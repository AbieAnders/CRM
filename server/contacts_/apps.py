from django.apps import AppConfig

class ContactsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'contacts_'

    def ready(self):
        import auth_.signals