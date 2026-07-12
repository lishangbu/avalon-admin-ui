let credential: string | null = null;

export function readTrainerSessionCredential(): string | null {
  return credential;
}

export function saveTrainerSessionCredential(nextCredential: string): void {
  credential = nextCredential;
}

export function clearTrainerSessionCredential(): void {
  credential = null;
}
