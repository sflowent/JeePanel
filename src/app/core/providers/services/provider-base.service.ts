import { CommandValue } from '@dashboards/models/command-value.model';
import { DashboardsEvent } from '@dashboards/services/dashboard-manager.service';
import { Observable } from 'rxjs';
import { CommandFormElementConfig } from '../models/command-form-element';
import { HistoryValue } from '@dashboards/features/charts/models/history-value.model';
import { ProviderSettings } from '../models/provider-settings.model';
import { Command } from '@dashboards/models/command.model';

export interface ProviderBaseService {
  
  settings: ProviderSettings;

  /**
   * Call when provider is stopped or deleted
   */
  OnDestroy(): void;

    /**
   * Set provider settings
   */
  setSettings(settings: ProviderSettings): ProviderSettings;

  /**
   * Get provider settings
   */
  getSettings(): ProviderSettings;

  /**
   * Get command value
   * @param commandRef 
   */
  getValue(commandRef: string): Observable<CommandValue>;

  /**
   * Get command history
   * @param commandRef 
   * @param start 
   * @param end 
   */
  getHistory(commandRef: string, start: Date, end: Date): Observable<HistoryValue[]>;

  /**
   * 
   * @param value 
   */
  getCommandLabelId(value: Command): string | null;

  /**
   * Get command from labelId
   * @param labelId 
   */
  getCommandByLabelId(labelId: string): Command | null;

  /**
   * Subscribe to dashboard update (View or Edit)
   * @param event 
   */
  onDashboardEvent(event: DashboardsEvent): void;

  /**
   * Subscribe to command value update
   * @param command 
   */
  onCommandUpdate(command: Command): Observable<CommandValue>;

  /**
   * Send Command to provider
   * @param command 
   * @param value 
   */
  sendCmd(command: Command, value: any): void;

    /**
   * Open Command picker Dialog Modal
   */
  openCommandPickerModal(element: CommandFormElementConfig, command: Command): Observable<Command>;

  /**
   * Open configuration Dialog Modal
   */
  openConfigurationModal(): Observable<ProviderSettings>;
}
