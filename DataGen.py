import numpy as np
import pandas as pd
from lightfm import LightFM
from lightfm.data import Dataset
from lightfm.evaluation import precision_at_k, auc_score
from lightfm.cross_validation import random_train_test_split

pd.set_option('display.max_columns', None)

statSize = 2000

participationLength = np.array([3.3, 3.2, 2.5, 5.1, 4.1, 4.1, 2.5, 2.8, 3.0, 3.1, 2.2, 2.6, 2.8, 4.3, 3.0, 2.8, 3.2, 1.9, 1.6])
std = np.std(participationLength)
avg = np.mean(participationLength)
print(std)
print(avg)

reasonsValues = np.array([25.0, 23, 19, 18, 14, 13, 6])
wholeSum = np.sum(reasonsValues)
for i in range(len(reasonsValues)):
    reasonsValues[i] = reasonsValues[i]/wholeSum

cleanReasons = np.array([reasonsValues[0], reasonsValues[1], reasonsValues[2] + reasonsValues[3], reasonsValues[5], reasonsValues[4] + reasonsValues[6]])
print(cleanReasons)

def estimate_normal_distribution(hist_counts, bin_edges):
    bin_centers = (bin_edges[:-1] + bin_edges[1:]) / 2
    mu = np.average(bin_centers, weights=hist_counts)
    var = np.average((bin_centers - mu)**2, weights=hist_counts)
    sigma = np.sqrt(var)
    return mu, sigma

hist_counts = np.array([10.3, 19.83, 19.72, 6.44, 7.88])
bin_edges = np.array([6, 18, 35, 55, 65, 99])
mu, sigma = estimate_normal_distribution(hist_counts, bin_edges)

sportNames = ['Cricket', 'Football', 'Volleyball', 'Field Hockey', 'Tennis', 'Basketball', 'Table Tennis', 'Baseball', 'Track and Field', 'Golf', 'Rugby', 'Badminton', 'American Football', 'Swimming', 'Gymnastics', 'Cycling', 'Ice Hockey', 'Handball', 'Rock Climbing', 'Frisbee', 'Bowling']
sportParticipation = [580, 1259.5, 338.1, 162.2, 1228.5, 995.6, 136.5, 57, 0, 1226, 620.3, 226, 0, 3541.8, 2.4, 2941.2, 2.4, 0, 300, 0, 9.6]
for i in range(len(sportParticipation)):
    if (sportParticipation[i] == 0):
        sportParticipation[i] = 5

sportParticipationasNpArray = np.array(sportParticipation)
sportParticipationSum = sum(sportParticipationasNpArray)
sportOdds = sportParticipation

for i in range(len(sportOdds)):
    sportOdds[i] = sportOdds[i]/sportParticipationSum

#------------------------------------------------------------------------------------------------------------------------#

df = pd.DataFrame()

genderOptions = ['M', 'F', 'O']
genderProbability = [0.495, 0.495, 0.01]

yearsOfExperience = np.random.normal(avg, std, statSize)
yearsOfExperience[yearsOfExperience < 0] = 0

daysTrainedPerWeek = [0, 1, 2, 3, 4, 5]
daysTrainedProbability = [0.08, 0.15, 0.15, 0.19, 0.18, 0.25]

indoorOutdoorChoices = ["Indoor", "Outdoor"]
indoorOutdoorProbability = [0.5, 0.5]

experienceCategory = yearsOfExperience
boundaries = [3, 2, 1, 0]
category_names = ['Advanced', 'Upper Intermediate', 'Intermediate', 'Beginner']
assignment = np.select(
    condlist=[experienceCategory >= b for b in boundaries],
    choicelist=category_names,
    default=np.nan
)
assignment = assignment.astype(str)

exerciseReasons = ['Fitness', 'Importance of Exercise', 'Mental Happiness and Stress', 'Challenging Myself', 'Other']
exerciseReasonsProbability = cleanReasons

ageDistribution = np.random.normal(mu, sigma, statSize)

#df['Gender'] = np.random.choice(genderOptions, size = statSize, p=genderProbability)
#df['YearsOfExperience'] = yearsOfExperience
#df['DaysPerWeek'] = np.random.choice(daysTrainedPerWeek, size = statSize, p=daysTrainedProbability)
#df['IndoorOutdoor'] = np.random.choice(indoorOutdoorChoices, size = statSize, p=indoorOutdoorProbability)
#df['ExperienceCategory'] = assignment
#df['ReasonForExercising'] = np.random.choice(exerciseReasons, size = statSize, p=exerciseReasonsProbability)
#df['Age'] = ageDistribution
df['Sport Preference'] = np.random.choice(sportNames, size = statSize, p=sportOdds)

def assign_age_range(age):
    if 18 <= age <= 25:
        return '18-25'
    elif 26 <= age <= 35:
        return '26-35'
    elif 36 <= age <= 45:
        return '36-45'
    elif 46 <= age <= 55:
        return '46-55'
    else:
        return '56+'

#df['Age Range'] = df['Age'].apply(assign_age_range)

#df = df.drop('Age', axis=1)
#df = df.drop('YearsOfExperience', axis=1)

#------------------------------------------------------------------------------------------------------------------------#

import random
import datetime

# Define the choices for the different fields
sports = ['Cricket', 'Football', 'Volleyball', 'Field Hockey', 'Tennis', 'Basketball', 'Table Tennis', 'Baseball', 'Track and Field', 'Golf', 'Rugby', 'Badminton', 'American Football', 'Swimming', 'Gymnastics', 'Cycling', 'Ice Hockey', 'Handball', 'Rock Climbing', 'Frisbee', 'Bowling']
skill_levels = ['Advanced', 'Upper Intermediate', 'Intermediate', 'Beginner']
age_ranges = ['18-25', '26-35', '36-45', '46-55', '56+']

# Define the number of games to generate
num_games = statSize

# Generate random games
game_data = []
for i in range(num_games):
    # Generate a random time using a normal distribution
    game_time = np.random.normal(12, 4)
    game_time = max(0, min(game_time, 23))
    game_time = datetime.time(int(game_time), random.randint(0, 59), random.randint(0, 59))
    oneAge = np.random.normal(mu, sigma, 1)
    indoutchoice = np.random.choice(indoorOutdoorChoices, size = 1, p=indoorOutdoorProbability)

    # Generate a random date
    game_date = datetime.date.today() + datetime.timedelta(days=random.randint(1, 365))

    game = {
        #'session_title': f'Game {i}',
        'sport_of_choice': random.choice(sports),
        #'confirmed_players': random.randint(1, 22),
        #'skill_rating': random.choice(skill_levels),
        #'age_range': random.choice(age_ranges),
        #'game_description': f'Description for game {i}',
        #'time': game_time,
        #'date': game_date,
        #'distance': random.randint(1, 35),
        #'indoorOutdoor': indoutchoice[0]
    }

    game_data.append(game)

games_df = pd.DataFrame(game_data)

#------------------------------------------------------------------------------------------------------------------------#

#df['Optimism'] = np.random.normal(0, 1, len(df))

ratings = np.zeros((len(df), len(games_df)))

base = 0.25
p = 0.07

def age_range_diff(range1, range2):
    mapping = {
        '18-25': 0,
        '26-35': 1,
        '36-45': 2,
        '46-55': 3,
        '56+': 4
    }
    diff = abs(mapping[range1] - mapping[range2])
    punishment = 2 * (1 / (1 + np.exp(-diff)) - 0.5)
    return punishment

def skill_rating_diff(rating1, rating2):
    mapping = {
        'Beginner': 0,
        'Intermediate': 1,
        'Upper Intermediate': 2,
        'Advanced': 3
    }
    diff = abs(mapping[rating1] - mapping[rating2])
    punishment = 2 * (1 / (1 + np.exp(-diff)) - 0.5)
    return punishment

def distance_rating(distance):
    rating = 1 / (1 + np.exp(distance - 15))
    return rating

ratings = []
for i, user in df.iterrows():
    for j, game in games_df.iterrows():
        if game['sport_of_choice'] == user['Sport Preference']:
            ratings.append((i, j, 3))
ratings_df = pd.DataFrame(ratings, columns=['user', 'game', 'rating'])

'''
for i, user in df.iterrows():
    for j, game in games_df.iterrows():
        #distance = game['distance']
        #rating += distance_rating(distance)

        if game['sport_of_choice'] == user['Sport Preference']:
            rating = 3 
            ratings[i, j] = rating

        if 5 <= game['confirmed_players'] <= 15:
            rating += 0.5
            

        age_range_difference = age_range_diff(game['age_range'], user['Age Range'])
        rating -= age_range_difference

        skill_rating_difference = skill_rating_diff(game['skill_rating'], user['ExperienceCategory'])
        rating -= skill_rating_difference

        if game['time'].hour < 12 or (game['time'].hour >= 13 and game['time'].hour < 18) and game['time'].hour >=6:
            rating += 0.4



        #rating = min(max(rating, 0), 5)

ratings_df = pd.DataFrame(ratings)
print(ratings_df)
'''
#------------------------------------------------------------------------------------------------------------------------#

dataset = Dataset()
dataset.fit(users=df.index.values,
            items=games_df.index.values,
            user_features=df.columns,
            item_features=games_df.columns)
user_features = dataset.build_user_features(((i, row.index[row.notnull()]) for i, row in df.iterrows()))
item_features = dataset.build_item_features(((i, row.index[row.notnull()]) for i, row in games_df.iterrows()))
interactions, weights = dataset.build_interactions(ratings_df.values)
train_interactions, test_interactions = random_train_test_split(interactions, test_percentage=0.2, random_state=42)
train_weights, test_weights = random_train_test_split(weights, test_percentage=0.2, random_state=42)

model = LightFM(
    learning_rate=0.05,
    loss='logistic',
    )

model.fit(
    train_interactions,
    item_features=item_features,
    user_features=user_features,
    sample_weight=train_weights,
    epochs=10,
    verbose=True)

new_user = df.iloc[0]
new_user_features = dataset.build_user_features([(0, new_user.index[new_user.notnull()])])
predictions = model.predict(0,
                            np.arange(len(games_df)),
                            user_features=new_user_features,
                            item_features=item_features)

print(new_user)
top_games = games_df.iloc[np.argsort(-predictions)][:5]
print(top_games)

games_with_ratings = games_df.copy()
games_with_ratings['rating'] = predictions
print(games_with_ratings)
print(games_with_ratings[games_with_ratings['sport_of_choice'] == new_user['Sport Preference']])

train_precision = precision_at_k(model, train_interactions, k=5, user_features = user_features, item_features=item_features).mean()
test_precision = precision_at_k(model, test_interactions, k=5, user_features = user_features, item_features=item_features, train_interactions=train_interactions).mean()

train_auc = auc_score(model, train_interactions, user_features = user_features, item_features=item_features).mean()
test_auc = auc_score(model, test_interactions, user_features = user_features, item_features=item_features, train_interactions=train_interactions).mean()

print('Precision: train %.2f, test %.2f.' % (train_precision, test_precision))
print('AUC: train %.2f, test %.2f.' % (train_auc, test_auc))