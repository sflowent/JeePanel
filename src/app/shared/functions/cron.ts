import { parseExpression } from 'cron-parser'; // Assurez-vous d'avoir installé cron-parser

export function cronNext(cronExpr: string): string {
  let result = '';

  const cronElts = cronExpr.split(' ');
  const cron = cronElts.slice(0, 5).join(' '); // Exclure l'année
  const year = cronElts[5] || null; // Obtenir l'année si elle existe

  try {
    let next;
    if (year) {
      // Ajouter une année pour limiter la plage d'exécution
      const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
      next = parseExpression(cron, {
        currentDate: new Date(`${year}-01-01T00:00:00.000Z`), // Démarrer au début de l'année spécifiée
        endDate: endDate,
      }).next();
    } else {
      // Pas de limitation sur l'année
      next = parseExpression(cron, { currentDate: new Date() }).next();
    }

    result = next.toISOString(); // Convertir la prochaine date en ISO string
  } catch (ex) {
    console.error('Error parsing cron expression:', ex);
  }

  return result;
}
