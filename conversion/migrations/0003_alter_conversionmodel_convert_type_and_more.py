# Generated by Django 4.2.6 on 2024-09-05 11:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('conversion', '0002_remove_conversionmodel_file_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conversionmodel',
            name='convert_type',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='conversionmodel',
            name='converted_file',
            field=models.FileField(null=True, upload_to='files/converted_files/'),
        ),
    ]
