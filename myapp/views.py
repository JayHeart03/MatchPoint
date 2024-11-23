from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode
from django.utils.http import urlsafe_base64_encode
from rest_framework import generics
from .serializers import GameSerializer
from .models import Game
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes

from .serializers import (
    UserSerializer,
    UserCreateSerializer,
    CustomTokenObtainPairSerializer,
    ProfileSerializer,
    ResetPasswordSerializer,
    SetPasswordSerializer,
)

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import status

from django.views.decorators.csrf import csrf_exempt
from .models import Game, User, Player, FavouriteGame, Friend, FriendRequest, ChatLog
from .serializers import (
    GameSerializer,
    UserSerializer,
    PlayerSerializer,
    FriendsSerializer,
    FriendRequestSerializer,
)
from django.http import JsonResponse
from django.db.models import Q
from datetime import date, timedelta
from django.utils import timezone
import predictionTime

from .serializers import FriendSerializer
from rest_framework import viewsets
from datetime import datetime
import json


from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import GameRanking
from .serializers import GameRankingSerializer

from rest_framework import generics, permissions


@api_view(["POST"])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
def add_game_ranking(request):
    user = request.user
    game_id = request.data.get("game_id")
    rating = request.data.get("rating")

    if game_id is None or rating is None:
        return Response(
            {"error": "game_id and rating are required fields"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        game_id = int(game_id)
        rating = int(rating)
    except ValueError:
        return Response(
            {"error": "game_id and rating should be integers"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not (1 <= rating <= 5):
        return Response(
            {"error": "rating should be between 1 and 5 inclusive"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    game_ranking = GameRanking.objects.create(game=game_id, user=user, ranking=rating)

    serializer = GameRankingSerializer(game_ranking)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


User = get_user_model()


class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        token = Token.objects.create(user=user)
        res = {
            "token": str(token.key),
            "user_id": user.pk,
            "email": user.email,
        }
        return Response(res, status=status.HTTP_201_CREATED)


class UserLoginView(generics.GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get("email", False)
        password = request.data.get("password", False)
        if email and password:
            try:
                user = User.objects.get(email=email)
                if user.check_password(password):
                    token, created = Token.objects.get_or_create(user=user)
                    res = {
                        "token": str(token.key),
                        "user_id": user.pk,
                        "email": user.email,
                    }
                    return Response(res, status=status.HTTP_200_OK)
                else:
                    return Response(
                        {"password": ["Wrong password."]},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except ObjectDoesNotExist:
                return Response(
                    {"email": ["User doesn't exist."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": ["Email and password are required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )


def check_username(request, username):
    if User.objects.filter(username=username).exists():
        return JsonResponse({"exists": True})
    else:
        return JsonResponse({"exists": False})


class ResetPasswordView(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"email": ["User with this email does not exist."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Generate the token and send the reset password link via email
        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        set_password_link = (
            f"https://matchpoint.games/PasswordAcceptForm?uidb64={uidb64}&token={token}"
        )

        send_mail(
            "Reset your password",
            f"Please click the following link to reset your password: {set_password_link}",
            "noreply@example.com",
            [email],
            fail_silently=False,
        )
        return Response(
            {"message": "Reset password email sent."}, status=status.HTTP_200_OK
        )


class SetPasswordView(generics.GenericAPIView):
    serializer_class = SetPasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uidb64 = kwargs.get("uidb64")
        token = kwargs.get("token")

        try:
            uidb64 = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uidb64)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.set_password(serializer.validated_data["password"])
            user.save()
            return Response(
                {"message": "Password reset successfully."}, status=status.HTTP_200_OK
            )

        return Response(
            {"token": ["Invalid token."]}, status=status.HTTP_400_BAD_REQUEST
        )


class CustomTokenObtainPairView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        # Set token expiration time to 24 hours from now
        token_expiration_time = timezone.now() + timedelta(seconds=2)
        token, created = Token.objects.get_or_create(user=user)
        token.expires = token_expiration_time
        token.save()
        return Response({"token": token.key, "user_id": user.pk, "email": user.email})


# class CustomTokenRefreshView(ObtainAuthToken):

#     def post(self, request, *args, **kwargs):
#         serializer = self.serializer_class(data=request.data,
#                                            context={'request': request})
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']
#         token, created = Token.objects.get_or_create(user=user)
#         return Response({
#             'token': token.key,
#             'user_id': user.pk,
#             'email': user.email
#         })


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class FriendRequestCreateView(generics.CreateAPIView):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        from_user_id = serializer.validated_data["from_user_id"]
        to_user_id = serializer.validated_data["to_user_id"]

        # Check if a friend request from the same user to the same user already exists
        if FriendRequest.objects.filter(
            from_user_id=from_user_id, to_user_id=to_user_id
        ).exists():
            return Response(
                {
                    "detail": "A friend request from this user to this user already exists"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create the friend request object
        friend_request = FriendRequest(from_user_id=from_user_id, to_user_id=to_user_id)
        friend_request.save()

        return Response(
            {"detail": "Friend request created"}, status=status.HTTP_201_CREATED
        )


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class FriendListCreateView(generics.ListCreateAPIView):
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer

    def post(self, request, *args, **kwargs):
        serializer = FriendSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class FriendRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = FriendSerializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class GameListCreateAPIView(generics.ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def post(self, request, *args, **kwargs):
        serializer = GameSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class GameRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

    def create(self, request, *args, **kwargs):
        game_id = request.data.get("game_id", None)
        user_id = request.data.get("user_id", None)

        if not game_id:
            return Response(
                {"game_id": ["This field is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user_id:
            return Response(
                {"user_id": ["This field is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        game = get_object_or_404(Game, pk=game_id)
        user = get_object_or_404(User, pk=user_id)

        if Player.objects.filter(game=game, user=user).exists():
            return Response(
                {"detail": "This user is already a player in this game."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        player = Player(game=game, user=user)
        player.save()

        serializer = PlayerSerializer(player)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(["GET"])
def api_root(request):
    return Response(
        {
            "users": reverse("users_list", request=request),
            "games": reverse("games_list", request=request),
        }
    )


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(["GET"])
def users_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(["GET"])
def user_detail(request, pk):
    user = get_object_or_404(User, pk=pk)
    serializer = UserSerializer(user)
    return Response(serializer.data)


# JoinGame Page
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# @api_view(['GET'])
# def games_list(request):
#    games = Game.objects.all()
#    serializer = GameSerializer(games, many=True)
#    return Response(serializer.data)


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def games_list(request):
    if request.method == "POST":
        # Fetch predictions based on the token
        
        print(request)
        
        id = request.user.id

        print(id)

        result = predictionTime.predict(id)

        print(result)

        # Fetch all games
        allGames = Game.objects.all()

        # Split the games into two sets based on whether they meet the condition
        sortedGames = []
        discardedGames = []
        for game in allGames:
            if game.game_id in result:
                sortedGames.append(game)
            else:
                discardedGames.append(game)

        # Sort the games according to the ranking (index order + 1 = rank in the frontend)
        sortedGames = sorted(sortedGames, key=lambda x: result.index(x.game_id))
        # Sort the discarded games according to gameid
        discardedGames = sorted(discardedGames, key=lambda x: x.game_id)

        # Append the sortedGames then the discardedGames to the finalGames
        finalGames = sortedGames + discardedGames

        # Format the finalGames and return them
        serializer = GameSerializer(finalGames, many=True)
        return Response(serializer.data)  # {"result": id})
    else:
        return Response("Invalid request method", status=400)


# @api_view(['GET'])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# def my_games_list(request):
#    players = Player.objects.filter(user_id=request.user.id)
#    games = Game.objects.filter(
#        game_id__in=[player.game_id for player in players])
#    serializer = GameSerializer(games, many=True)
#    return Response(serializer.data)


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def my_games_list(request):
    if request.method == "POST":
        # Fetch predictions based on the token
        id = request.user.id
        result = predictionTime.predict(id)

        # Fetch all games that match the section requirements
        players = Player.objects.filter(user_id=request.user.id)
        allGames = Game.objects.filter(
            game_id__in=[player.game_id for player in players]
        )

        # Split the games into two sets based on whether they meet the condition
        sortedGames = []
        discardedGames = []
        for game in allGames:
            if game.game_id in result:
                sortedGames.append(game)
            else:
                discardedGames.append(game)

        # Sort the games according to the ranking (index order + 1 = rank in the frontend)
        sortedGames = sorted(sortedGames, key=lambda x: result.index(x.game_id))
        # Sort the discarded games according to gameid
        discardedGames = sorted(discardedGames, key=lambda x: x.game_id)

        # Append the sortedGames then the discardedGames to the finalGames
        finalGames = sortedGames + discardedGames

        # Format the finalGames and return them
        serializer = GameSerializer(finalGames, many=True)
        return Response(serializer.data)  # {"result": id})
    else:
        return Response("Invalid request method", status=400)


# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# @api_view(['GET'])
# def favourite_games_list(request):
#    favourites = FavouriteGame.objects.filter(user_id=request.user.id)
#    games = Game.objects.filter(
#        game_id__in=[favourite.game_id for favourite in favourites])
#    serializer = GameSerializer(games, many=True)
#    return Response(serializer.data)


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def favourite_games_list(request):
    if request.method == "POST":
        # Fetch predictions based on the token
        id = request.user.id
        result = predictionTime.predict(id)

        # Fetch all games that match the section requirements
        favourites = FavouriteGame.objects.filter(user_id=request.user.id)
        allGames = Game.objects.filter(
            game_id__in=[favourite.game_id for favourite in favourites]
        )

        # Split the games into two sets based on whether they meet the condition
        sortedGames = []
        discardedGames = []
        for game in allGames:
            if game.game_id in result:
                sortedGames.append(game)
            else:
                discardedGames.append(game)

        # Sort the games according to the ranking (index order + 1 = rank in the frontend)
        sortedGames = sorted(sortedGames, key=lambda x: result.index(x.game_id))
        # Sort the discarded games according to gameid
        discardedGames = sorted(discardedGames, key=lambda x: x.game_id)

        # Append the sortedGames then the discardedGames to the finalGames
        finalGames = sortedGames + discardedGames

        # Format the finalGames and return them
        serializer = GameSerializer(finalGames, many=True)
        return Response(serializer.data)  # {"result": id})
    else:
        return Response("Invalid request method", status=400)


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def retrieve_predictions(request):
    if request.method == "POST":
        # Fetch predictions based on the token
        id = request.user.id
        result = predictionTime.predict(id)

        # Fetch all games
        allGames = Game.objects.all()

        # Split the games into two sets based on whether they meet the condition
        sortedGames = []
        discardedGames = []
        for game in allGames:
            if game.game_id in result:
                sortedGames.append(game)
            else:
                discardedGames.append(game)

        # Sort the games according to the ranking (index order + 1 = rank in the frontend)
        sortedGames = sorted(sortedGames, key=lambda x: result.index(x.game_id))
        # Sort the discarded games according to gameid
        discardedGames = sorted(discardedGames, key=lambda x: x["game_id"])

        # Append the sortedGames then the discardedGames to the finalGames
        finalGames = sortedGames + discardedGames

        # Format the finalGames and return them
        serializer = GameSerializer(finalGames, many=True)
        return Response(serializer.data)  # {"result": id})
    else:
        return Response("Invalid request method", status=400)


# Game Lobby page
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(["GET"])
def game(request, id):
    game = get_object_or_404(Game, game_id=id)
    serializer = GameSerializer(game)
    return Response(serializer.data)


# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# @api_view(['GET'])
# def get_game_players(request, matchid):
#    data = Player.objects.filter(
#        game__game_id=matchid)  # .values('user__name')
#    players = []
#    for p in data:
#        players.append({'player_id': p.user.id, 'player_username': p.user.username, 'player_first_name': p.user.first_name, 'player_last_name': p.user.last_name})
#
#    return JsonResponse({'players': players, 'currentPlayerPlaying': False})


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_game_players(request, matchid):
    # Fetch all players with a game_id foreign key = matchid
    players = Player.objects.filter(game_id=matchid)

    # Determine whether or not the user specified by request.user.id is present in the players list
    # Also add formatting to the players that will be returned
    formattedPlayers = []
    user_present = False
    for player in players:
        formattedPlayers.append(
            {
                "player_id": player.user.id,
                "player_username": player.user.username,
                "player_first_name": player.user.first_name,
                "player_last_name": player.user.last_name,
            }
        )

        if player.user_id == request.user.id:
            user_present = True

    return Response({"players": formattedPlayers, "user_present": user_present})


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_game_favourite(request, matchid):
    # Fetch all players with a game_id foreign key = matchid
    favourites = FavouriteGame.objects.filter(game_id=matchid)

    # Determine whether or not the user specified by request.user.id is present in the favourites list
    user_present = False
    for favourite in favourites:
        if favourite.user_id == request.user.id:
            user_present = True

    return Response({"user_present": user_present})


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(["DELETE"])
def remove_game(request, id):
    game = Game.objects.get(game_id=id)
    game.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(["PUT"])
def update_game_status(request, id):
    game = Game.objects.get(game_id=id)
    game.status = request.data["status"]
    game.save()
    return Response(status=status.HTTP_200_OK)


# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# @api_view(['GET'])
# def add_player(request, matchid):
#    id = request.user.id
#    player = Player(
#        game_id=matchid,
#        user_id=id,
#    )
#    #player.save()
#    serializer = PlayerSerializer(player)
#    return Response(serializer.data)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_player(request, matchid):
    # Fetch all players with a game_id foreign key = matchid
    # players = Player.objects.filter(game_id=matchid)
    player = Player(
        game_id=matchid,
        user_id=request.user.id,
    )
    player.save()

    return Response({"player_added": request.user.id})


@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def remove_player(request, matchid):
    players = Player.objects.filter(game__game_id=matchid, user_id=request.user.id)

    for p in players:
        p.delete()
    return Response({"player_removed": request.user.id})


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_favourite(request, matchid):
    # Fetch all players with a game_id foreign key = matchid
    # players = Player.objects.filter(game_id=matchid)
    favourite = FavouriteGame(
        game_id=matchid,
        user_id=request.user.id,
    )
    favourite.save()

    return Response({"favourite_added": matchid})


@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def remove_favourite(request, matchid):
    favourites = FavouriteGame.objects.filter(
        game__game_id=matchid, user_id=request.user.id
    )

    for favourite in favourites:
        favourite.delete()
    return Response({"favourite_removed": matchid})


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(["PUT"])
def add_game(request):
    game = Game(name="game_name", description="game_description")
    game.save()
    serializer = GameSerializer(game)
    return Response(serializer.data)


@api_view(["POST", "GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def game_create(request):
    serializer = GameSerializer(data=request.data)
    if serializer.is_valid():
        game = serializer.save(id=request.user)
        Player.objects.create(game=game, user=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# Social Page


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def my_friends(request):
    user = request.user.id
    friends = Friend.objects.filter(user_1=user)
    serializer = FriendsSerializer(friends, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def searchfriendsname(request, name):
    user = User.objects.get(id=request.user.id)
    friend = Friend.objects.filter(user_1=user, user_2__username__icontains=name)
    serializer = FriendsSerializer(friend, many=True)
    return Response(serializer.data)


@api_view(["POST", "GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def send_request(request, to_username):
    user = request.user.id
    from_user = User.objects.get(id=user)
    to_user = User.objects.get(username=to_username)
    frequest = FriendRequest.objects.create(from_user=from_user, to_user=to_user)
    frequest.save()
    return Response({"success": "request sent", "request_id": frequest.id})


@api_view(["POST", "GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def accept_request(request, pk):
    frequest = FriendRequest.objects.get(id=pk)
    user1 = frequest.to_user
    user2 = frequest.from_user
    Friend.objects.create(user_1=user1, user_2=user2)
    Friend.objects.create(user_1=user2, user_2=user1)
    frequest.delete()
    return Response({"success": "request accepted"})


@api_view(["POST", "GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def reject_request(request, pk):
    frequest = FriendRequest.objects.get(id=pk)
    frequest.delete()
    return Response({"success": "request rejected"})


@api_view(["POST", "GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def removeFriend(request, friend_pk):
    user_pk = request.user.id
    user = User.objects.get(id=user_pk)
    friend = User.objects.get(id=friend_pk)
    Friend.objects.filter(user_1=user, user_2=friend).delete()
    Friend.objects.filter(user_1=friend, user_2=user).delete()
    return Response({"success": "friend removed"})


@api_view(["POST", "GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getFriendRequests(request):
    pk = request.user.id
    frequest = FriendRequest.objects.filter(to_user=pk)
    serializer = FriendRequestSerializer(frequest, many=True)
    return Response(serializer.data)


@api_view(["POST", "GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getFriendRequsetfromuser(request):
    pk = request.user.id
    frequest = FriendRequest.objects.filter(from_user=pk)
    serializer = FriendRequestSerializer(frequest, many=True)
    return Response(serializer.data)


@api_view(["POST", "GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getrecentplayedwith(request):
    user_pk = request.user.id
    user = User.objects.get(id=user_pk)
    user_games = Game.objects.filter(player__user=user)
    recent_games = user_games.order_by("-date", "-end_time").first()
    recent_players = Player.objects.filter(game=recent_games).exclude(user=user)
    recent_players_serializer = PlayerSerializer(recent_players, many=True)
    return Response(recent_players_serializer.data)


@api_view(["POST", "GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getusername(request):
    user = request.user.username
    return Response({"user_name": user})


# View Profile
@api_view(["PUT", "GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user_id = request.user.id

    try:
        profiles = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = ProfileSerializer(profiles)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = ProfileSerializer(profiles, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Stats Page Views


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def usernameview(request):
    user_id = request.user.id
    user = User.objects.get(id=user_id)
    data = {
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }
    return Response(data)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def joindate(request):
    user_id = request.user.id
    user = User.objects.get(id=user_id)
    data = {"id": user.id, "username": user.username, "join_date": user.created_at}
    return Response(data)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def friendcount(request):
    user_id = request.user.id
    user = User.objects.get(id=user_id)
    friend_count = Friend.objects.filter(Q(user_1=user_id) | Q(user_2=user_id)).count()
    data = {"id": user.id, "friend_count": friend_count}
    return Response(data)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def upcoming_games(request):
    user_id = request.user.id
    user = User.objects.get(id=user_id)
    upcoming_games = Game.objects.filter(player__id=user_id)
    upcoming_games_list = []
    today = date.today()

    for game in upcoming_games:
        if game.date > today:
            upcoming_games_list.append(
                {
                    "user_id": user.id,
                    "game_id": game.game_id,
                    "name": game.session_title,
                    "sport": game.sport,
                    "location": game.location,
                    "date": game.date,
                    "time": game.start_time,
                }
            )
    return JsonResponse({"games": upcoming_games_list})


@api_view(["POST", "GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def chatmsg(request, matchid):
    if request.method == "GET":
        msglist = ChatLog.objects.filter(game_id=matchid)
        allmsg = []
        for msg in msglist:
            allmsg.append(msg.from_user.username + ":" + msg.chat_content)
        return JsonResponse({"msglist": allmsg})
    elif request.method == "POST":
        data = request.data
        user_id = request.user.id
        user = User.objects.get(id=user_id)
        game = Game.objects.get(id=data["matchid"])
        newmsg = ChatLog(
            from_user=user,
            game_id=game,
            chat_content=data["msg"],
            msg_date=datetime.now().strftime("%Y-%m-%d"),
            msg_time=datetime.now().strftime("%H:%M:%S"),
        )
        newmsg.save()
        return JsonResponse({"sendstatus": "ok"})
        # return JsonResponse({"sendstatus":serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# Stats Page Views


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def username_view(request):
    user_id = request.user.id
    user = User.objects.get(id=user_id)
    data = {
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }
    return JsonResponse(data)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def join_date(request):
    user_id = request.user.id
    user = User.objects.get(id=user_id)
    data = {"id": user.id, "username": user.username, "join_date": user.created_at}
    return JsonResponse(data)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def friend_count(request):
    user_id = request.user.id
    friend_view = Friend.objects.filter(user_1=user_id) | Friend.objects.filter(
        user_2=user_id
    )
    friend_view_list = []
    added_friends = set()
    for friends in friend_view:
        if user_id == friends.user_1.id:
            friend_id = friends.user_2.id
            friend_name = friends.user_2.username
        else:
            friend_id = friends.user_1.id
            friend_name = friends.user_1.username
        if friend_id not in added_friends:
            friend_view_list.append({"id": friend_id, "username": friend_name})
            added_friends.add(friend_id)
    friend_count = len(friend_view_list)
    return JsonResponse({"friend_count": friend_count})


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def upcoming_games(request):
    user_id = request.user.id
    upcoming_games = Game.objects.filter(player__user_id=user_id)
    upcoming_games_list = []
    today = date.today()

    for game in upcoming_games:
        if game.date > today:
            upcoming_games_list.append(
                {
                    "id": game.game_id,
                    "name": game.session_title,
                    "sport": game.sport,
                    "location": game.location,
                    "date": game.date,
                    "time": game.start_time,
                }
            )
    return JsonResponse({"games": upcoming_games_list})


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def past_games(request):
    user_id = request.user.id
    past_games = Game.objects.filter(player__user_id=user_id).order_by("-date")
    past_games_list = []
    today = date.today()

    for game in past_games:
        if game.date < today:
            past_games_list.append(
                {
                    "id": game.game_id,
                    "name": game.session_title,
                    "date": game.date,
                }
            )
    return JsonResponse({"games": past_games_list})


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def friend_view(request):
    user_id = request.user.id
    friend_view = Friend.objects.filter(user_1=user_id) | Friend.objects.filter(
        user_2=user_id
    )
    friend_view_list = []
    added_friends = set()
    for friends in friend_view:
        if user_id == friends.user_1.id:
            friend_id = friends.user_2.id
            friend_name = friends.user_2.username
        else:
            friend_id = friends.user_1.id
            friend_name = friends.user_1.username
        if friend_id not in added_friends:
            friend_view_list.append({"id": friend_id, "username": friend_name})
            added_friends.add(friend_id)
    return JsonResponse({"friends": friend_view_list})


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def pregames(request):
    user_id = request.user.id
    upcoming_games = Game.objects.filter(player__user_id=user_id)
    today = date.today()
    last_week = today - timedelta(days=7)
    last_month = today - timedelta(days=30)
    last_90_days = today - timedelta(days=90)
    last_year = today - timedelta(days=365)

    games_last_week = upcoming_games.filter(Q(date__gte=last_week) & Q(date__lt=today))
    games_last_month = upcoming_games.filter(
        Q(date__gte=last_month) & Q(date__lt=today)
    )
    games_last_90_days = upcoming_games.filter(
        Q(date__gte=last_90_days) & Q(date__lt=today)
    )
    games_last_year = upcoming_games.filter(Q(date__gte=last_year) & Q(date__lt=today))
    games_all_time = upcoming_games.filter(Q(date__lt=today))

    games_last_week_list = []
    games_last_month_list = []
    games_last_90_days_list = []
    games_last_year_list = []
    games_all_time_list = []

    for game in games_last_week:
        games_last_week_list.append(
            {
                "name": game.session_title,
                "sport": game.sport,
                "date": game.date,
            }
        )

    for game in games_last_month:
        games_last_month_list.append(
            {
                "name": game.session_title,
                "sport": game.sport,
                "date": game.date,
            }
        )

    for game in games_last_90_days:
        games_last_90_days_list.append(
            {
                "name": game.session_title,
                "sport": game.sport,
                "date": game.date,
            }
        )

    for game in games_last_year:
        games_last_year_list.append(
            {
                "name": game.session_title,
                "sport": game.sport,
                "date": game.date,
            }
        )

    for game in games_all_time:
        games_all_time_list.append(
            {
                "name": game.session_title,
                "sport": game.sport,
                "date": game.date,
            }
        )

    return JsonResponse(
        {
            "games_last_week": games_last_week_list,
            "games_last_month": games_last_month_list,
            "games_last_90_days": games_last_90_days_list,
            "games_last_year": games_last_year_list,
            "games_all_time": games_all_time_list,
        }
    )


# FriendStats Page Views


@api_view(["GET"])
def fget_username(request, user_id):
    user = User.objects.get(id=user_id)
    data = {
        "id": user.id,
        "username": user.username,
    }
    return JsonResponse(data)


@api_view(["GET"])
def fjoin_date(request, user_id):
    user = User.objects.get(id=user_id)
    data = {"id": user.id, "username": user.username, "join_date": user.created_at}
    return JsonResponse(data)


@api_view(["GET"])
def ffriend_count(request, user_id):
    friend_view = Friend.objects.filter(user_1=user_id) | Friend.objects.filter(
        user_2=user_id
    )
    friend_view_list = []
    added_friends = set()
    for friends in friend_view:
        if user_id == friends.user_1.id:
            friend_id = friends.user_2.id
            friend_name = friends.user_2.username
        else:
            friend_id = friends.user_1.id
            friend_name = friends.user_1.username
        if friend_id not in added_friends:
            friend_view_list.append({"id": friend_id, "username": friend_name})
            added_friends.add(friend_id)
    friend_count = len(friend_view_list)
    return JsonResponse({"friend_count": friend_count})


@api_view(["GET"])
def fupcoming_games(request, user_id):
    upcoming_games = Game.objects.filter(player__user_id=user_id)
    upcoming_games_list = []
    today = date.today()

    for game in upcoming_games:
        if game.date > today:
            upcoming_games_list.append(
                {
                    "id": game.game_id,
                    "name": game.session_title,
                    "sport": game.sport,
                    "location": game.location,
                    "date": game.date,
                    "time": game.start_time,
                }
            )
    return JsonResponse({"games": upcoming_games_list})


@api_view(["GET"])
def fpast_games(request, user_id):
    past_games = Game.objects.filter(player__user_id=user_id).order_by("-date")
    past_games_list = []
    today = date.today()

    for game in past_games:
        if game.date < today:
            past_games_list.append(
                {
                    "id": game.game_id,
                    "name": game.session_title,
                    "date": game.date,
                }
            )
    return JsonResponse({"games": past_games_list})


@api_view(["GET"])
def ffriend_view(request, user_id):
    friend_view = Friend.objects.filter(user_1=user_id) | Friend.objects.filter(
        user_2=user_id
    )
    friend_view_list = []
    added_friends = set()
    for friends in friend_view:
        if user_id == friends.user_1.id:
            friend_id = friends.user_2.id
            friend_name = friends.user_2.username
        else:
            friend_id = friends.user_1.id
            friend_name = friends.user_1.username
        if friend_id not in added_friends:
            friend_view_list.append({"id": friend_id, "username": friend_name})
            added_friends.add(friend_id)
    return JsonResponse({"friends": friend_view_list})


@api_view(["GET"])
def fpregames(request, user_id):
    # user_id = request.user.id
    upcoming_games = Game.objects.filter(player__user_id=user_id)
    today = date.today()
    last_week = today - timedelta(days=7)
    last_month = today - timedelta(days=30)
    last_90_days = today - timedelta(days=90)
    last_year = today - timedelta(days=365)

    games_last_week = upcoming_games.filter(Q(date__gte=last_week) & Q(date__lt=today))
    games_last_month = upcoming_games.filter(
        Q(date__gte=last_month) & Q(date__lt=today)
    )
    games_last_90_days = upcoming_games.filter(
        Q(date__gte=last_90_days) & Q(date__lt=today)
    )
    games_last_year = upcoming_games.filter(Q(date__gte=last_year) & Q(date__lt=today))
    games_all_time = upcoming_games.filter(Q(date__lt=today))

    games_last_week_list = []
    games_last_month_list = []
    games_last_90_days_list = []
    games_last_year_list = []
    games_all_time_list = []

    for game in games_last_week:
        games_last_week_list.append(
            {
                "name": game.session_title,
                "sport": game.sport,
                "location": game.location,
                "date": game.date,
            }
        )

    for game in games_last_month:
        games_last_month_list.append(
            {
                "name": game.session_title,
                "sport": game.sport,
                "location": game.location,
                "date": game.date,
            }
        )

    for game in games_last_90_days:
        games_last_90_days_list.append(
            {
                "name": game.session_title,
                "sport": game.sport,
                "location": game.location,
                "date": game.date,
            }
        )

    for game in games_last_year:
        games_last_year_list.append(
            {
                "name": game.session_title,
                "sport": game.sport,
                "location": game.location,
                "date": game.date,
            }
        )

    for game in games_all_time:
        games_all_time_list.append(
            {
                "name": game.session_title,
                "sport": game.sport,
                "location": game.location,
                "date": game.date,
            }
        )

    return JsonResponse(
        {
            "games_last_week": games_last_week_list,
            "games_last_month": games_last_month_list,
            "games_last_90_days": games_last_90_days_list,
            "games_last_year": games_last_year_list,
            "games_all_time": games_all_time_list,
        }
    )


from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import GameRanking
from .serializers import GameRankingSerializer


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_game_ranking(request):
    user = request.user
    game_id = request.data.get("game_id")
    rating = request.data.get("rating")

    if game_id is None or rating is None:
        return Response(
            {"error": "game_id and rating are required fields"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        game_id = int(game_id)
        rating = int(rating)
    except ValueError:
        return Response(
            {"error": "game_id and rating should be integers"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not (1 <= rating <= 5):
        return Response(
            {"error": "rating should be between 1 and 5 inclusive"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    game_ranking = GameRanking.objects.create(game=game_id, user=user, ranking=rating)

    serializer = GameRankingSerializer(game_ranking)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
