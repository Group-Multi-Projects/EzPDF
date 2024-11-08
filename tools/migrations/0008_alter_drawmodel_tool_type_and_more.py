# Generated by Django 4.2.6 on 2024-08-04 00:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tools', '0007_imagemodel_canvas_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='drawmodel',
            name='tool_type',
            field=models.CharField(max_length=20, null=True, verbose_name='Tool Type'),
        ),
        migrations.AlterField(
            model_name='geometrymodel',
            name='tool_type',
            field=models.CharField(max_length=20, null=True, verbose_name='Tool Type'),
        ),
        migrations.AlterField(
            model_name='imagemodel',
            name='tool_type',
            field=models.CharField(max_length=20, null=True, verbose_name='Tool Type'),
        ),
        migrations.AlterField(
            model_name='textmodel',
            name='tool_type',
            field=models.CharField(max_length=20, null=True, verbose_name='Tool Type'),
        ),
    ]
