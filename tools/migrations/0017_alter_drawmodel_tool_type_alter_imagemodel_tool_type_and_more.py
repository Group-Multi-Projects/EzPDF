# Generated by Django 4.2.6 on 2024-08-08 16:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tools', '0016_alter_textmodel_font_size'),
    ]

    operations = [
        migrations.AlterField(
            model_name='drawmodel',
            name='tool_type',
            field=models.CharField(default='draw', max_length=20, null=True, verbose_name='Tool Type'),
        ),
        migrations.AlterField(
            model_name='imagemodel',
            name='tool_type',
            field=models.CharField(default='image', max_length=20, null=True, verbose_name='Tool Type'),
        ),
        migrations.AlterField(
            model_name='shapemodel',
            name='tool_type',
            field=models.CharField(default='shape', max_length=20, null=True, verbose_name='Tool Type'),
        ),
        migrations.AlterField(
            model_name='textmodel',
            name='tool_type',
            field=models.CharField(default='text', max_length=20, null=True, verbose_name='Tool Type'),
        ),
    ]
