import os
import django
import pandas as pd
from datetime import date
import numpy as np
import random
from lightfm import LightFM
from lightfm.data import Dataset
from lightfm.evaluation import precision_at_k, auc_score
from lightfm.cross_validation import random_train_test_split
from lightfm.evaluation import recall_at_k
import pickle
from scipy import sparse

os.environ['DJANGO_SETTINGS_MODULE'] = 'TeamBackend.settings'
django.setup()

from django.contrib.auth import get_user_model
from myapp.models import Game, GameRanking

sportNames = [x.upper() for x in ['Cricket', 'Football', 'Volleyball', 'Field Hockey', 'Tennis', 'Basketball', 'Table Tennis', 'Baseball', 'Track and Field', 'Golf', 'Rugby', 'Badminton', 'American Football', 'Swimming', 'Gymnastics', 'Cycling', 'Ice Hockey', 'Handball', 'Rock Climbing', 'Frisbee', 'Bowling']]
age_ranges = ['18-25', '26-35', '36-45', '46-55', '56-65', 'Over 65']
listOfExperienceFeatures = ['skill:ADVANCED', 'skill:LOWER INTERMEDIATE', 'skill:UPPER INTERMEDIATE', 'skill:INTERMEDIATE', 'skill:BEGINNER']

def prepend_strings(df, strings):
    new_df = df.copy()
    for i, col in enumerate(new_df.columns):
        new_df[col] = strings[i] + new_df[col].astype(str)
    return new_df

def df_to_tuples(df):
    result = []
    for index, row in df.iterrows():
        result.append((int(row['id'].split(':')[1]), row.tolist()))
    return result

def assign_age_range(age):
    if 18 <= age <= 25:
        return '18-25'
    elif 26 <= age <= 35:
        return '26-35'
    elif 36 <= age <= 45:
        return '36-45'
    elif 46 <= age <= 55:
        return '46-55'
    elif 55 <= age <= 65:
        return '56-65'
    else:
        return 'Over 65'
    
def age_range_diff(range1, range2):
    mapping = {
        '18-25': 0,
        '26-35': 1,
        '36-45': 2,
        '46-55': 3,
        '56-65': 4,
        'Over 65': 5
    }
    diff = abs(mapping[range1] - mapping[range2])
    punishment = (2 / (1 + np.exp(-diff))) - 1
    return punishment

def skill_rating_diff(rating1, rating2):
    mapping = {
        'BEGINNER': 0,
        'LOWER INTERMEDIATE': 1,
        'INTERMEDIATE': 2,
        'UPPER INTERMEDIATE': 4,
        'ADVANCED': 4
    }
    diff = abs(mapping[rating1] - mapping[rating2])
    punishment = (2 / (1 + np.exp(-diff))) - 1
    return punishment

#-------------------------------------------------------------------------------------------------------------------------------------------#

User = get_user_model()

users = User.objects.all()
data = { 'date_of_birth': [], 'Sport Preference': [], 'ExperienceCategory': [], 'id':[]}

for user in users:
    data['date_of_birth'].append(user.date_of_birth)
    data['Sport Preference'].append(user.sport.upper())
    data['ExperienceCategory'].append(user.skill_level.upper())
    data['id'].append(user.id)

df = pd.DataFrame(data)
df['date_of_birth'] = pd.to_datetime(df['date_of_birth'])
today = date.today()
df['age'] = df['date_of_birth'].apply(lambda x: today.year - x.year - ((today.month, today.day) < (x.month, x.day)))
df.drop(columns=['date_of_birth'], inplace=True)
df['age'] = df['age'].clip(lower=18, upper=85)
df['Age Range'] = df['age'].apply(assign_age_range)
#----------------------------------------------------------------------------------------------------------------------------------------------#

games = Game.objects.all()
data = {'sport_of_choice': [], 'confirmed_players': [], 'age_range':[], 'time':[], 'skill_rating':[], 'id':[]}

for game in games:
    data['sport_of_choice'].append(game.sport.upper())
    data['confirmed_players'].append(game.confirmed_players)
    data['age_range'].append(game.age_range)
    data['time'].append(game.start_time.strftime('%H'))
    data['skill_rating'].append(game.skill_rating.upper())
    data['id'].append(game.game_id)

games_df = pd.DataFrame(data)

#----------------------------------------------------------------------------------------------------------------------------------------------#
game_rankings = GameRanking.objects.all()
data = [{'user': gr.user.id, 'game': gr.game, 'rating': gr.ranking} for gr in game_rankings]
ratings_df = pd.DataFrame(data)
#----------------------------------------------------------------------------------------------------------------------------------------------#
listOfAges=['age:' + (str(x)) for x in range(18, 86)] 
listOfSports=['sport:' + s.upper() for s in sportNames]
listOfAgeRanges=['range:'+ s for s in age_ranges]
listOfIds = ['id:' + str(x) for x in df['id'].unique().tolist()]
user_feature_list = listOfExperienceFeatures + listOfSports + listOfAgeRanges + listOfAges + listOfIds

prepended_df = prepend_strings(df, ['sport:', 'skill:', 'id:', 'age:', 'range:'])
user_formatted = df_to_tuples(prepended_df)
#------------------------------------------------------------------------------------------------------------------------------------------------#
playerCount_feature = ["count:" + str(x) for x in range (1,23)]
time_feature = ["time:0"+ str(x) for x in range(0,10)] + ["time:"+str(x) for x in range(10,24)]
item_list_of_ids = ['id:' + str(x) for x in games_df['id'].unique().tolist()]

item_feature_list = playerCount_feature + time_feature + listOfSports + listOfExperienceFeatures + listOfAgeRanges + item_list_of_ids

prepended_games = prepend_strings(games_df, ['sport:', 'count:', 'range:', 'time:', 'skill:', 'id:'])
formatted_games = df_to_tuples(prepended_games)
#-------------------------------------------------------------------------------------------------------------------------------------------------#
dataset = Dataset()

uniqueuids = df['id'].unique().tolist()
unique_item_ids = games_df['id'].unique().tolist()

dataset.fit(users=uniqueuids,
            items=unique_item_ids,
            user_features=user_feature_list,
            item_features=item_feature_list)

user_id_map, user_feature_map, item_id_map, item_feature_map = dataset.mapping()

user_features = dataset.build_user_features(user_formatted)
item_features = dataset.build_item_features(formatted_games)


interactions, weights = dataset.build_interactions([(x[0], x[1], x[2]) for x in ratings_df.values])
train_interactions, test_interactions = random_train_test_split(interactions, test_percentage=0.2, random_state=36)
train_weights, test_weights = random_train_test_split(weights, test_percentage=0.2, random_state=36)

model = LightFM(
    learning_rate=0.075,
    loss='warp',
    )

model.fit(
    train_interactions,
    item_features=item_features,
    user_features=user_features,
    sample_weight = train_weights,
    epochs=10,
    verbose=True)

train_precision = precision_at_k(model, interactions, k=5, user_features = user_features, item_features = item_features).mean()
test_precision = precision_at_k(model, test_interactions, k=5, user_features = user_features, item_features = item_features, train_interactions=train_interactions).mean()

train_auc = auc_score(model, interactions, user_features = user_features, item_features = item_features).mean()
test_auc = auc_score(model, test_interactions, user_features = user_features, item_features = item_features, train_interactions=train_interactions).mean()

print('Precision: train %.2f, Precision test %.2f' % (train_precision, test_precision))
print('AUC: train %.2f , AUC: test %.2f' % (train_auc, test_auc))

#-------------------------------------------------------------------------------------------------------------------------------------------#

#Write out our model

with open('games_df.pkl', 'wb') as file:
    pickle.dump(games_df, file)

with open('model_filename.pkl', 'wb') as file:
    pickle.dump(model, file)

with open ('dataset_filename.pkl', 'wb') as file:
    pickle.dump(dataset, file)

with open ('user_features.pkl', 'wb') as file:
    pickle.dump(user_features, file)

with open ('item_features.pkl', 'wb') as file:
    pickle.dump(item_features, file)

with open ('user_feature_list.pkl', 'wb') as file:
    pickle.dump(user_feature_list, file)