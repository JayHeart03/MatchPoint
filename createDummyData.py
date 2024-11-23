import os
import django
import numpy as np
import pandas as pd
import random
from datetime import date, timedelta, datetime
import math

os.environ['DJANGO_SETTINGS_MODULE'] = 'TeamBackend.settings'
django.setup()

from django.utils import timezone
from django.contrib.auth import get_user_model
from myapp.models import PlayingEnvironment, Motivation, Game, Sport, SkillLevel, AgeRange, GameRanking

statSize = 1000

participationLength = np.array([3.3, 3.2, 2.5, 5.1, 4.1, 4.1, 2.5, 2.8, 3.0, 3.1, 2.2, 2.6, 2.8, 4.3, 3.0, 2.8, 3.2, 1.9, 1.6])
std = np.std(participationLength)
avg = np.mean(participationLength)

reasonsValues = np.array([25.0, 23, 19, 18, 14, 13, 6])
wholeSum = np.sum(reasonsValues)

for i in range(len(reasonsValues)):
    reasonsValues[i] = reasonsValues[i]/wholeSum

cleanReasons = np.array([reasonsValues[0], reasonsValues[1], reasonsValues[2] + reasonsValues[3], reasonsValues[5], reasonsValues[4] + reasonsValues[6]])

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

genderOptions = ['Male', 'Female', 'Other']
genderProbability = [0.495, 0.495, 0.01]

yearsOfExperience = np.random.normal(avg, std, statSize)
yearsOfExperience[yearsOfExperience < 0] = 0

experienceCategory = yearsOfExperience
boundaries = [3, 2, 1, 0]
category_names = ['Advanced', 'Upper Intermediate', 'Intermediate', 'Beginner']
assignment = np.select(
    condlist=[experienceCategory >= b for b in boundaries],
    choicelist=category_names,
    default=np.nan
)
assignment = assignment.astype(str)

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

#---------------------------------------------------------------------------------------------------------------------------------------------

User = get_user_model()

def create_dummy_users(num_users):
    for i in range(num_users):
        first_name = f"User{i+1}"
        last_name = f"LastName{i+1}"
        username = f"user{i+1}"
        email = f"user{i+1}@example.com"
        phone_number = f"050978345{i+1}"
        location = "Birmingham"
        location_latitude = random.uniform(52.375, 52.535)
        location_longitude = random.uniform(-1.94, -1.75)
        
        ageDistribution = np.random.normal(mu, sigma, 1)
        ageDistribution = int(ageDistribution)

        age_choice = ageDistribution
        if(age_choice < 18):
            age_choice = 18
        if(age_choice > 85):
            age_choice = 85
            
        date_of_birth = timezone.now().date() - timedelta(days =age_choice*365) # random date of birth between 18 and 80 years
        sport = np.random.choice(sportNames, p=sportOdds)
        playing_environment = random.choice([tag.name for tag in PlayingEnvironment])
        skill_level = random.choice(assignment)
        motivation = random.choice([tag.name for tag in Motivation])
        gender = np.random.choice(genderOptions, p=genderProbability)

        user = User(
            first_name=first_name,
            last_name=last_name,
            username=username,
            email=email,
            phone_number=phone_number,
            location=location,
            date_of_birth=date_of_birth,
            sport=sport,
            playing_environment=playing_environment,
            skill_level=skill_level,
            motivation=motivation,
            gender=gender,
            location_latitude=location_latitude,
            location_longitude=location_longitude,
        )
        user.set_password("password")
        user.save()

def delete_dummy_users():
    User.objects.filter(email__contains="example.com").delete()

def create_dummy_games(num_games):
    users = list(User.objects.all())
    for i in range(num_games):
        session_title = f"{i+1}"
        organisation = f"Organisation {i+1}"
        game_description = f"Game {i+1}"
        confirmed_players = random.randint(1, 22)
        start_time = timezone.now().replace(hour=random.randint(0, 23), minute=random.randint(0, 59), second=0, microsecond=0)
        end_time = timezone.now().replace(hour=random.randint(0, 23), minute=random.randint(0, 59), second=0, microsecond=0)
        date = timezone.now().date() + timedelta(days=random.randint(1, 30))

        sport = np.random.choice([choice.value for choice in Sport])
        skill_rating = np.random.choice([choice.value for choice in SkillLevel])
        age_range = np.random.choice([choice.value for choice in AgeRange])

        location = f"Birmingham, UK"
        location_latitude = random.uniform(52.389722, 52.4862)
        location_longitude = random.uniform(-1.931924, -1.7913) 

        user = random.choice(users)
        game = Game(
            session_title=session_title,
            organisation=organisation,
            game_description=game_description,
            confirmed_players=confirmed_players,
            start_time=start_time,
            end_time=end_time,
            date=date,
            sport=sport,
            skill_rating=skill_rating,
            age_range=age_range,
            location=location,
            location_latitude=location_latitude,
            location_longitude=location_longitude,
            id=user,
        )

        game.save()
        users.remove(user)

def delete_dummy_games():
    games = Game.objects.filter(organisation__startswith="Organisation ")
    games.delete()


delete_dummy_users()
create_dummy_users(500)

delete_dummy_games()
create_dummy_games(500)

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

print(games_df)
print(df)

ratings = np.zeros((len(df), len(games_df)))
p = 0.07
ratings = []
for i, user in df.iterrows():
    for j, game in games_df.iterrows():
        if (game['sport_of_choice'] == user['Sport Preference']):
            rating = 0
            if(game['sport_of_choice'] == user['Sport Preference']):
                rating = 4

            if 5 <= game['confirmed_players'] <= 15:
                rating += 1
                
            age_range_difference = age_range_diff(game['age_range'], user['Age Range'])
            rating -= age_range_difference

            skill_rating_difference = skill_rating_diff(game['skill_rating'], user['ExperienceCategory'])
            rating -= skill_rating_difference

            if int(game['time']) < 12 or (int(game['time']) >= 13 and int(game['time']) < 18) and int(game['time']) >=6:
                rating += 1

            rating = min(max(rating, 0), 5)

            user_instance = User.objects.get(id=user['id'])
            game_instance = Game.objects.get(game_id=game['id'])

            ranking_instance = GameRanking(user=user_instance, game=game_instance.pk, ranking=rating)

            ranking_instance.save()


