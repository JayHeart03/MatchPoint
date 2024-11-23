from .models import FriendRequest
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

# from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# from rest_framework_simplejwt.tokens import RefreshToken  # Add this line
from .models import Game, Player, Friend, FriendRequest

from rest_framework import serializers
from .models import GameRanking

from .models import User


class GameRankingSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField()

    class Meta:
        model = GameRanking

        fields = ("game", "user_id", "ranking")

        read_only_fields = ["id", "game_id", "user_id"]

    def get_user_id(self, obj):
        return obj.user.id


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    id = serializers.IntegerField(read_only=True)


class UserCreateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "password",
            "username",
            "first_name",
            "last_name",
            "phone_number",
            "location",
            "date_of_birth",
            "sport",
            "skill_level",
            "motivation",
            "playing_environment",
            "gender",
            "location_longitude",
            "location_latitude",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class SetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=128)
    confirm_password = serializers.CharField(max_length=128)

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")
        return data


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["id"] = user.id
        return token


# class CustomTokenRefreshSerializer(serializers.Serializer):
#     refresh = serializers.CharField()

#     def validate(self, attrs):
#         refresh = RefreshToken(attrs['refresh'])

#         data = {'access': str(refresh.access_token)}
#         user = refresh.get('user')
#         if user:
#             data['id'] = user.id

#         return data


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = "__all__"


class PlayerSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source="user.username")
    game = GameSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Player
        fields = "__all__"


class FriendsSerializer(serializers.ModelSerializer):
    friends_user_1 = serializers.ReadOnlyField(source="user_1.username")
    friends_user_2 = serializers.ReadOnlyField(source="user_2.username")

    class Meta:
        model = Friend
        fields = "__all__"


class FriendRequestSerializer(serializers.ModelSerializer):
    from_user_name = serializers.ReadOnlyField(source="from_user.username")
    to_user_name = serializers.ReadOnlyField(source="to_user.username")

    class Meta:
        model = FriendRequest
        fields = "__all__"


class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = ("id", "user_1_id", "user_2_id")

    def validate(self, data):
        if data["user_1_id"] == data["user_2_id"]:
            raise serializers.ValidationError("User 1 and User 2 cannot be the same.")
        return data


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


from rest_framework import serializers
from .models import GameRanking


class GameRankingSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField()

    class Meta:
        model = GameRanking
        fields = ("game", "user_id", "ranking")

    def get_user_id(self, obj):
        return obj.user.id
