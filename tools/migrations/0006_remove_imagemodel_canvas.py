# Generated by Django 4.2.6 on 2024-08-03 23:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tools', '0005_remove_imagemodel_canvas_id_imagemodel_canvas'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='imagemodel',
            name='canvas',
        ),
    ]
