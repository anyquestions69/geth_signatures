# Generated by Django 4.2 on 2023-04-15 08:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_remove_user_password_alter_user_wallet'),
    ]

    operations = [
        migrations.AddField(
            model_name='signature',
            name='hash',
            field=models.CharField(null=True),
        ),
    ]