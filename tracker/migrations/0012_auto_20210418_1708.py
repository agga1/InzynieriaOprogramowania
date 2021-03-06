# Generated by Django 3.1.7 on 2021-04-18 17:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_auto_20210329_2243'),
        ('tracker', '0011_auto_20210418_1451'),
    ]

    operations = [
        migrations.AddField(
            model_name='prize',
            name='course',
            field=models.ForeignKey(default=-1, on_delete=django.db.models.deletion.CASCADE, to='tracker.course'),
            preserve_default=False,
        ),
        migrations.RemoveField(
            model_name='prize',
            name='student',
        ),
        migrations.AddField(
            model_name='prize',
            name='student',
            field=models.ManyToManyField(blank=True, to='accounts.Student'),
        ),
    ]
