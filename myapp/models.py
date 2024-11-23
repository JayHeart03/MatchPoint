from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from enum import Enum
from django.contrib.auth.base_user import BaseUserManager
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")

        # Check the previous id and increment it by 1
        previous_user = self.model.objects.order_by("-id").first()
        if previous_user is None:
            id = 1
        else:
            id = previous_user.id + 1

        email = self.normalize_email(email)
        user = self.model(email=email, id=id, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        # Check the previous id and increment it by 1
        previous_user = self.model.objects.order_by("-id").first()
        if previous_user is None:
            id = 1
        else:
            id = previous_user.id + 1

        email = self.normalize_email(email)
        superuser = self.model(email=email, id=id, **extra_fields)
        superuser.set_password(password)
        superuser.save(using=self._db)
        return superuser


class DayOfWeek(Enum):
    MONDAY = "Monday"
    TUESDAY = "Tuesday"
    WEDNESDAY = "Wednesday"
    THURSDAY = "Thursday"
    FRIDAY = "Friday"
    SATURDAY = "Saturday"
    SUNDAY = "Sunday"


class Sport(Enum):
    CRICKET = "Cricket"
    FOOTBALL = "Football"
    VOLLEYBALL = "Volleyball"
    FIELD_HOCKEY = "Field Hockey"
    TENNIS = "Tennis"
    BASKETBALL = "Basketball"
    TABLE_TENNIS = "Table Tennis"
    BASEBALL = "Baseball"
    GOLF = "Golf"
    RUGBY = "Rugby"
    BADMINTON = "Badminton"
    AMERICAN_FOOTBALL = "American Football"
    SWIMMING = "Swimming"
    GYMNASTICS = "Gymnastics"
    CYCLING = "Cycling"
    ICE_HOCKEY = "Ice Hockey"
    HANDBALL = "Handball"
    ROCK_CLIMBING = "Rock Climbing"
    FRISBEE = "Frisbee"
    BOWLING = "Bowling"


class SkillLevel(Enum):
    BEGINNER = "Beginner"
    LOWER_INTERMEDIATE = "Lower Intermediate"
    INTERMEDIATE = "Intermediate"
    UPPER_INTERMEDIATE = "Upper Intermediate"
    ADVANCED = "Advanced"


class Motivation(Enum):
    FUN = "Fun"
    COMPETITION = "Competition"
    HEALTH = "Health"
    SOCIAL = "Social"
    OTHER = "Other"


class PlayingEnvironment(Enum):
    INDOOR = "Indoor"
    OUTDOOR = "Outdoor"
    BOTH = "Both"


class Gender(Enum):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"


class Status(Enum):
    NOT_STARTED = "Not_Started"
    STARTED = "Started"
    FINISHED = "Finished"


class AgeRange(Enum):
    # _0_18 = 'Under 18' This might not be allowed due to child protection laws and their data protection
    _18_25 = "18-25"
    _26_35 = "26-35"
    _36_45 = "36-45"
    _46_55 = "46-55"
    _56_65 = "56-65"
    _65_120 = "Over 65"


class User(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    username = models.CharField(max_length=30, blank=True, null=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=50, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    created_at = models.DateField(auto_now_add=True, null=True)
    sport = models.CharField(
        max_length=200,
        choices=[(tag.name, tag.value) for tag in Sport],
        blank=True,
        null=True,
    )
    playing_environment = models.CharField(
        max_length=100,
        choices=[(tag.name, tag.value) for tag in PlayingEnvironment],
        blank=True,
        null=True,
    )
    skill_level = models.CharField(
        max_length=200,
        choices=[(tag.name, tag.value) for tag in SkillLevel],
        blank=True,
        null=True,
    )
    motivation = models.CharField(
        max_length=200,
        choices=[(tag.name, tag.value) for tag in Motivation],
        blank=True,
        null=True,
    )
    gender = models.CharField(
        max_length=100,
        choices=[(tag.name, tag.value) for tag in Gender],
        blank=True,
        null=True,
    )
    location_latitude = models.FloatField(null=True, blank=True)
    location_longitude = models.FloatField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True


class Game(models.Model):
    # Normal fields
    game_id = models.AutoField(primary_key=True)
    id = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    session_title = models.CharField(max_length=50, default="")
    organisation = models.CharField(max_length=50, default="")
    # image = models.CharField(max_length=50, default='')
    game_description = models.CharField(max_length=50, default="")
    confirmed_players = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(22)], default=0
    )
    start_time = models.TimeField(default="00:00:00")
    end_time = models.TimeField(default="00:00:00")
    date = models.DateField(default="2000-01-01")

    # Fields that require validation due to the use of Enum types
    sport = models.CharField(max_length=50, default="Cricket")
    skill_rating = models.CharField(max_length=50, default="Other")
    age_range = models.CharField(max_length=50, default="Other")
    status = models.CharField(max_length=50, default="Not_Started")

    # Fields that require geospacing api
    location = models.CharField(max_length=200)
    location_latitude = models.FloatField(null=True, blank=True)
    location_longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.session_title

    # Trigger to ensure the validation function is called whenever there is an attempt to insert a record into this table of the database

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(sport__in=[choice.value for choice in Sport]),
                name="game: check_valid_sport",
            ),
            models.CheckConstraint(
                check=models.Q(
                    skill_rating__in=[choice.value for choice in SkillLevel]
                ),
                name="game: check_valid_skill_level",
            ),
            models.CheckConstraint(
                check=models.Q(age_range__in=[choice.value for choice in AgeRange]),
                name="game: check_valid_age_range",
            ),
            models.CheckConstraint(
                check=models.Q(status__in=[choice.value for choice in Status]),
                name="game: check_valid_status",
            ),
        ]


class DatesAvailable(models.Model):
    # Normal Fields
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # Fields that require validation due to the use of Enum types
    day = models.CharField(max_length=20, default="Other")

    def __str__(self):
        return f"{self.user.username} ({self.day})"

    # Trigger to ensure the validation function is called whenever there is an attempt to insert a record into this table of the database
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(day__in=[choice.value for choice in DayOfWeek]),
                name="days_available: check_valid_day",
            ),
            models.UniqueConstraint(fields=["user", "day"], name="unique_user_day"),
        ]


class Player(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} ({self.game.session_title})"


class FavouriteGame(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} ({self.game.session_title})"


class GameRanking(models.Model):
    game = models.IntegerField(default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ranking = models.IntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(5)]
    )

    def __str__(self):
        return f"rating = {self.ranking}, game_id = {self.game}"


class Friend(models.Model):
    user_1 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friends_user_1"
    )
    user_2 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friends_user_2"
    )

    def __str__(self):
        return f"{self.user_1.username} and {self.user_2.username}"


class FriendRequest(models.Model):
    from_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friend_requests_sent"
    )
    to_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friend_requests_received"
    )

    def __str__(self):
        return (
            f"{self.from_user.username} sent friend request to {self.to_user.username}"
        )


class ChatLog(models.Model):
    chat_id = models.AutoField(primary_key=True)
    from_user = models.ForeignKey(User, on_delete=models.CASCADE)
    game_id = models.ForeignKey(Game, on_delete=models.CASCADE)
    chat_content = models.CharField(max_length=500)
    msg_date = models.DateField()
    msg_time = models.TimeField()

    def __str__(self):
        return f"There are about {self.chat_id}  messages"
