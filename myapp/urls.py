from django.urls import path
from .views import UserCreateView, UserLoginView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from .views import FriendRequestCreateView
from .views import FriendListCreateView, FriendRetrieveUpdateDestroyView
from .views import GameListCreateAPIView, GameRetrieveUpdateDestroyAPIView
from .views import UserViewSet, GameViewSet, PlayerViewSet
from django.contrib.auth import views as auth_views
from .views import ResetPasswordView, SetPasswordView
from .views import check_username
from .views import add_game_ranking

# from .views import GameRankingCreateAPIView

urlpatterns = [
    path("game_rankings/", add_game_ranking, name="add_game_ranking"),
    path("register/", UserCreateView.as_view(), name="register"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("check-username/<str:username>/", check_username, name="check_username"),
    path("token/", views.CustomTokenObtainPairView.as_view()),
    path("reset-password/", ResetPasswordView.as_view(), name="reset_password"),
    path(
        "set-password/<str:uidb64>/<str:token>/",
        SetPasswordView.as_view(),
        name="set_password",
    ),
    path(
        "friend-requests/",
        FriendRequestCreateView.as_view(),
        name="friend-request-create",
    ),
    path("addfriends/", FriendListCreateView.as_view(), name="friend-list"),
    path(
        "findfriends/<int:pk>/",
        FriendRetrieveUpdateDestroyView.as_view(),
        name="friend-detail",
    ),
    path(
        "creategames/",
        GameListCreateAPIView.as_view(),
        name="game_list_create_api_view",
    ),
    path(
        "findgames/<int:pk>/",
        GameRetrieveUpdateDestroyAPIView.as_view(),
        name="game_retrieve_update_destroy_api_view",
    ),
    path(
        "users/",
        UserViewSet.as_view({"get": "list", "post": "create"}),
        name="user-list",
    ),
    path(
        "users/<int:pk>/",
        UserViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),
        name="user-detail",
    ),
    path(
        "players/",
        PlayerViewSet.as_view({"get": "list", "post": "create"}),
        name="player-list",
    ),
    path(
        "players/<int:pk>/",
        PlayerViewSet.as_view(
            {"get": "retrieve", "put": "update", "delete": "destroy"}
        ),
        name="player-detail",
    ),
    path("", views.api_root),
    path("users/", views.users_list, name="users_list"),
    path("users/<int:pk>/", views.user_detail, name="user_detail"),
    path("predictions/", views.retrieve_predictions, name="predictions"),
    # JoinGame page urls
    path("games/", views.games_list, name="games_list"),
    path("my-games/", views.my_games_list, name="games_list"),
    path("favourite-games/", views.favourite_games_list, name="games_list"),
    # Game Lobby page
    path("games/<int:id>/", views.game, name="game"),
    path("update-game-status/<int:id>/", views.update_game_status, name="remove_game"),
    path(
        "get_game_players/<int:matchid>",
        views.get_game_players,
        name="get_game_players",
    ),
    path(
        "get_game_favourite/<int:matchid>",
        views.get_game_favourite,
        name="get_game_favourite",
    ),
    path("add-player/<int:matchid>", views.add_player, name="add_player"),
    path("remove-player/<int:matchid>", views.remove_player, name="remove_player"),
    path("add-favourite/<int:matchid>", views.add_favourite, name="add_favourite"),
    path(
        "remove-favourite/<int:matchid>",
        views.remove_favourite,
        name="remove_favourite",
    ),
    # chatmsg
    path("chatmsg/<int:matchid>/", views.chatmsg, name="Chatmsg"),
    path("games/create/", views.game_create, name="game_create"),
    # Social page urls
    path("getfriendsrequest/", views.getFriendRequests, name="getFriendRequests"),
    path(
        "getfriendsrequestfromuser/",
        views.getFriendRequsetfromuser,
        name="getFriendRequsetfromuser",
    ),
    path("send_request/<str:to_username>/", views.send_request, name="send_request"),
    path("accept_request/<int:pk>/", views.accept_request, name="accept_request"),
    path("reject_request/<int:pk>/", views.reject_request, name="reject_request"),
    path("friends/", views.my_friends, name="my_friends"),
    path("removefriend/<int:friend_pk>/", views.removeFriend, name="removefriend"),
    path(
        "searchfriends/<str:name>/", views.searchfriendsname, name="searchfriendsname"
    ),
    path("getrecentplayedwith/", views.getrecentplayedwith, name="getrecentplayedwith"),
    path("getusername/", views.getusername, name="getusername"),
    path("profiles/", views.get_profile, name="profile_detail"),  # View Profile
    # Stats Page Urls
    path("username/", views.username_view, name="Username"),
    path("join_date/", views.join_date, name="Date Joined"),
    path("friend_count/", views.friend_count, name="Friend Count"),
    path("ugames/", views.upcoming_games, name="Upcoming Games"),
    path("past_games/", views.past_games, name="past_games"),
    path("friend_view/", views.friend_view, name="friend_view"),
    path("pregames/", views.pregames, name="game_intervals"),
    # FriendStats Page Urls
    path("fusername/<int:user_id>/", views.fget_username, name="get_username"),
    path("fjoin_date/<int:user_id>/", views.fjoin_date, name="get_join_date"),
    path("ffriend_count/<int:user_id>/", views.ffriend_count, name="friend_count"),
    path(
        "fupcoming_games/<int:user_id>/", views.fupcoming_games, name="upcoming_games"
    ),
    path("fpast_games/<int:user_id>/", views.fpast_games, name="past_games"),
    path("ffriend_view/<int:user_id>/", views.ffriend_view, name="friend_view"),
    path("fpregames/<int:user_id>/", views.fpregames, name="game_intervals"),
]
