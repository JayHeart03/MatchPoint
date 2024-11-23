from django.contrib.auth import get_user_model
from myapp.models import GameRanking, User
import pickle
import numpy as np
from scipy import sparse
from lightfm import LightFM
from lightfm.data import Dataset
from lightfm.evaluation import precision_at_k, auc_score
from lightfm.cross_validation import random_train_test_split
from lightfm.evaluation import recall_at_k
import django
import os
from datetime import date

os.environ['DJANGO_SETTINGS_MODULE'] = 'TeamBackend.settings'
django.setup()


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


with open('model_filename.pkl', 'rb') as file:
    model = pickle.load(file)

with open('dataset_filename.pkl', 'rb') as file:
    dataset = pickle.load(file)

with open('games_df.pkl', 'rb') as file:
    games_df = pickle.load(file)

with open('user_features.pkl', 'rb') as file:
    user_features = pickle.load(file)

with open('item_features.pkl', 'rb') as file:
    item_features = pickle.load(file)

with open('user_feature_list.pkl', 'rb') as file:
    user_feature_list = pickle.load(file)

user_id_map, user_feature_map, item_id_map, item_feature_map = dataset.mapping()


def format_newuser_input(user_feature_map, user_feature_list):
    num_features = len(user_feature_list)
    normalised_val = 1.0
    target_indices = []
    for feature in user_feature_list:
        try:
            target_indices.append(user_feature_map[feature])
        except KeyError:
            print("new user feature encountered '{}'".format(feature))
            pass

    new_user_features = np.zeros(len(user_feature_map.keys()))
    for i in target_indices:
        new_user_features[i] = normalised_val
    new_user_features = sparse.csr_matrix(new_user_features)
    return (new_user_features)


def predict(user_id):

    print(user_id)

    user = User.objects.get(id=user_id)

    print(user)

    sport = "sport:" + user.sport
    skill_level = "skill:" + user.skill_level
    date_of_birth = user.date_of_birth
    age = date.today().year - date_of_birth.year - ((date.today().month,
                                                         date.today().day) < (date_of_birth.month, date_of_birth.day))

    uid_feature_list = [sport, skill_level, 'age:' +
                        str(age), 'range:' + str(assign_age_range(age))]

    print(uid_feature_list)

    new_user_features = format_newuser_input(
        user_feature_map, uid_feature_list)
    predictions = model.predict(0, np.arange(
        500), user_features=new_user_features)
    top_games = games_df.iloc[np.argsort(-predictions)][:500]
    print(top_games)
    return top_games['id'].tolist()
