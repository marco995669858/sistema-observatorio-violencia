import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface Space {
  placa: string;
  entryTime: Date;
}

interface HistoryRecord {
  type: string;
  placa: string;
  time: Date;
  space: number;
  duration?: number;
}

const TOTAL_SPACES = 20;

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('app-parqueadero');

  TOTAL_SPACES = TOTAL_SPACES;

  // --- MÓDULO DE ALMACENAMIENTO (Estado en memoria usando Signals) ---
  spaces = signal<(Space | null)[]>(Array(TOTAL_SPACES).fill(null));
  history = signal<HistoryRecord[]>([]);

  // --- ESTADOS DE LA INTERFAZ ---
  plateInput = signal<string>('');
  message = signal<{ text: string; type: string }>({ text: '', type: '' });
  activeTab = signal<'control' | 'historial'>('control');

  // --- MÓDULO DE PROCESAMIENTO (Cálculos derivados usando computed) ---
  occupiedSpacesCount = computed(() => this.spaces().filter((space) => space !== null).length);
  availableSpacesCount = computed(() => TOTAL_SPACES - this.occupiedSpacesCount());

  // --- MÓDULO DE CONTROL Y LÓGICA ---
  showMessage(text: string, type: string) {
    this.message.set({ text, type });
    setTimeout(() => this.message.set({ text: '', type: '' }), 5000);
  }

  updatePlate(event: Event) {
    this.plateInput.set((event.target as HTMLInputElement).value);
  }

  registrarEntrada(e: Event) {
    e.preventDefault();
    const placa = this.plateInput().trim().toUpperCase();

    if (!placa) {
      this.showMessage('Por favor, ingrese una placa válida.', 'error');
      return;
    }

    if (this.availableSpacesCount() === 0) {
      this.showMessage('Acceso denegado: No hay espacios disponibles.', 'error');
      return;
    }

    // Verificar si el vehículo ya está adentro
    const currentSpaces = this.spaces();
    const isAlreadyInside = currentSpaces.some((space) => space?.placa === placa);
    if (isAlreadyInside) {
      this.showMessage(
        `El vehículo con placa ${placa} ya se encuentra en el estacionamiento.`,
        'error',
      );
      return;
    }

    // Encontrar el primer espacio disponible
    const emptyIndex = currentSpaces.findIndex((space) => space === null);

    if (emptyIndex !== -1) {
      const entryTime = new Date();

      this.spaces.update((spaces) => {
        const newSpaces = [...spaces];
        newSpaces[emptyIndex] = { placa, entryTime };
        return newSpaces;
      });

      // Registrar en el historial
      this.history.update((h) => [
        { type: 'ENTRADA', placa, time: entryTime, space: emptyIndex + 1 },
        ...h,
      ]);

      this.showMessage(
        `Acceso permitido: Vehículo ${placa} registrado en el espacio ${emptyIndex + 1}.`,
        'success',
      );
      this.plateInput.set('');
    }
  }

  registrarSalida(e: Event) {
    e.preventDefault();
    const placa = this.plateInput().trim().toUpperCase();

    if (!placa) {
      this.showMessage('Por favor, ingrese una placa válida.', 'error');
      return;
    }

    // Buscar el vehículo
    const currentSpaces = this.spaces();
    const spaceIndex = currentSpaces.findIndex((space) => space?.placa === placa);

    if (spaceIndex === -1) {
      this.showMessage(
        `Error: No se encontró el vehículo con placa ${placa} en el establecimiento.`,
        'error',
      );
      return;
    }

    const exitTime = new Date();
    const entryTime = currentSpaces[spaceIndex]!.entryTime;

    // Liberar el espacio
    this.spaces.update((spaces) => {
      const newSpaces = [...spaces];
      newSpaces[spaceIndex] = null;
      return newSpaces;
    });

    // Calcular tiempo de estadía (simulado para el prototipo)
    const timeDiff = Math.abs(exitTime.getTime() - entryTime.getTime());
    const minutes = Math.floor(timeDiff / 1000 / 60);

    // Registrar en el historial
    this.history.update((h) => [
      { type: 'SALIDA', placa, time: exitTime, space: spaceIndex + 1, duration: minutes },
      ...h,
    ]);

    this.showMessage(
      `Salida registrada: Vehículo ${placa} liberó el espacio ${spaceIndex + 1}.`,
      'success',
    );
    this.plateInput.set('');
  }

  // Funciones auxiliares para formateo de texto en la plantilla
  formatTime(date: Date) {
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  currentDate() {
    return new Date().toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatIndex(index: number) {
    return (index + 1).toString().padStart(2, '0');
  }
}
