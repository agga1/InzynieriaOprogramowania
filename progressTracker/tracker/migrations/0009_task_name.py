# Generated by Django 3.1.7 on 2021-04-13 17:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0008_auto_20210406_2026'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='name',
            field=models.CharField(default='nazwa', max_length=100),
            preserve_default=False,
        ),
    ]
