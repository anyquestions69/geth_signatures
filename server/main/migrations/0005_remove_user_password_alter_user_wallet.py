# Generated by Django 4.2 on 2023-04-15 07:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_user_password_user_wallet_signature'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='password',
        ),
        migrations.AlterField(
            model_name='user',
            name='wallet',
            field=models.CharField(max_length=42, null=True),
        ),
    ]