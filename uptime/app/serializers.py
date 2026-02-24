from rest_framework import serializers
from .models import Website


class WebsiteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Website
        fields = ["id", "website_name", "website_url", "interval"]

    def validate_interval(self, value):
        if value < 1 or value > 1440:
            raise serializers.ValidationError("Interval must be between 1 and 1440 minutes")
        return value
