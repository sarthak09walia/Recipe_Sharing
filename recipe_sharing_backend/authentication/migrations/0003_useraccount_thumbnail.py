# Generated by Django 4.2.1 on 2023-06-02 16:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_remove_useraccount_site'),
    ]

    operations = [
        migrations.AddField(
            model_name='useraccount',
            name='thumbnail',
            field=models.ImageField(default='image', upload_to='profilePicture/'),
            preserve_default=False,
        ),
    ]
