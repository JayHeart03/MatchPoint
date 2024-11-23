from .models import Game, Player, User, Friend, FriendRequest, GameRanking
from django.contrib import admin
from .models import User


class UserAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "email",
        "first_name",
        "last_name",
        "username",
        "phone_number",
        "location",
        "playing_environment",
        "date_of_birth",
        "created_at",
        "sport",
        "skill_level",
        "motivation",
        "gender",
        "location_latitude",
        "location_longitude",
        "is_active",
        "is_staff",
        "is_superuser",
    ]


admin.site.register(User, UserAdmin)


admin.site.register(Game)
admin.site.register(Player)
admin.site.register(Friend)
admin.site.register(FriendRequest)
admin.site.register(GameRanking)
