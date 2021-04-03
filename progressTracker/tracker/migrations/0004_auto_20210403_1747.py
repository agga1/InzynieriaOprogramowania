# Generated by Django 3.1.7 on 2021-04-03 15:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_auto_20210329_2243'),
        ('tracker', '0003_auto_20210402_0840'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='pass_threshold',
            field=models.SmallIntegerField(default=50),
        ),
        migrations.AddField(
            model_name='course',
            name='student',
            field=models.ManyToManyField(to='accounts.Student'),
        ),
    ]
