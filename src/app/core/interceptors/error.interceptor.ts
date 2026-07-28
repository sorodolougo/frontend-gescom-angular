// src/app/core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // Injection des services NG-ZORRO et Routing d'Angular
  const notification = inject(NzNotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur inattendue est survenue.';
      let errorTitle = 'Erreur Système';

      // Traitement chirurgical selon le code d'erreur HTTP renvoyé par Spring Boot
      switch (error.status) {
        case 400:
          errorTitle = 'Requête Invalide';
          // Si ton backend Spring Boot renvoie un message précis (ex: validation de champ)
          errorMessage = error.error?.message || 'Les données fournies sont incorrectes.';
          break;

        case 401:
          errorTitle = 'Session Expirée';
          errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
          router.navigate(['/auth/login']); // Redirection automatique
          break;

        case 403:
          errorTitle = 'Accès Refusé';
          errorMessage = "Vous n'avez pas les droits nécessaires pour effectuer cette action.";
          break;

        case 409:
          errorTitle = 'Conflit de données';
          errorMessage = error.error?.message || 'Cette ressource ou ce SKU existe déjà.';
          break;

        case 500:
          errorTitle = 'Erreur Serveur';
          errorMessage = 'Le serveur de l’ERP rencontre un problème. Veuillez réessayer plus tard.';
          break;

        case 0:
          errorTitle = 'Erreur Réseau';
          errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion internet.';
          break;

        default:
          errorMessage = `Code d'erreur : ${error.status}. ${error.message}`;
          break;
      }

      // GAGNE DE TEMPS MASSIF : Notification visuelle automatique à l'écran
      notification.error(errorTitle, errorMessage, {
        nzPlacement: 'topRight',
        nzDuration: 5000 // Reste visible 5 secondes
      });

      // On propage l'erreur pour que le composant puisse stopper ses loaders (ex: isSubmitting = false)
      return throwError(() => error);
    })
  );
};
