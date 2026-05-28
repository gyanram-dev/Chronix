import { useState, useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { useTaskStore } from '../store/taskStore';
import { useProgressStore } from '../store/progressStore';
import { useAcademicStore } from '../store/academicStore';
import { usePlannerStore } from '../store/plannerStore';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import SettingsSection from '../components/ui/SettingsSection';
import ColorPicker from '../components/ui/ColorPicker';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import {
  Palette, Timer, GraduationCap, Bell, Database,
  Download, Upload, AlertTriangle,
} from 'lucide-react';

export default function Settings() {
  const settings = useSettingsStore();
  const fileInputRef = useRef(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);
  const [importStatus, setImportStatus] = useState(null);

  const semesters = useAcademicStore((s) => s.semesters);

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      version: 1,
      settings: useSettingsStore.getState(),
      tasks: useTaskStore.getState().tasks,
      progress: useProgressStore.getState().categories,
      academic: useAcademicStore.getState().semesters,
      planner: usePlannerStore.getState(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chronix-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportStatus('Data exported successfully');
    setTimeout(() => setExportStatus(null), 2500);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.version) throw new Error('Invalid backup file');
        setImportStatus('File parsed — import logic ready for store hydration');
      } catch {
        setImportStatus('Invalid file format');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    useTaskStore.persist.clearStorage();
    useProgressStore.persist.clearStorage();
    useAcademicStore.persist.clearStorage();
    usePlannerStore.persist.clearStorage();
    settings.resetAll();
    window.location.reload();
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Settings"
        description="Configure your app preferences."
      />

      {/* Appearance */}
      <SettingsSection icon={Palette} title="Appearance" description="Customize the look and feel of Chronix.">
        <ToggleSwitch
          enabled={settings.appearance.darkMode}
          onChange={(v) => settings.updateAppearance({ darkMode: v })}
          label="Dark mode"
          description="Always-on dark theme for this version."
        />
        <ColorPicker
          value={settings.appearance.accentColor}
          onChange={(v) => settings.updateAppearance({ accentColor: v })}
          label="Accent color"
        />
        <ToggleSwitch
          enabled={settings.appearance.compactMode}
          onChange={(v) => settings.updateAppearance({ compactMode: v })}
          label="Compact mode"
          description="Reduce spacing for a denser layout."
        />
      </SettingsSection>

      {/* Productivity */}
      <SettingsSection icon={Timer} title="Productivity" description="Configure your study workflow and daily targets.">
        <div className="flex items-center justify-between gap-4 py-1">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-200">Daily target hours</p>
            <p className="text-xs text-zinc-500 mt-0.5">Your goal for total study time each day.</p>
          </div>
          <input
            type="number"
            min={0}
            max={24}
            step={0.5}
            value={settings.productivity.dailyTargetHours}
            onChange={(e) => settings.updateProductivity({ dailyTargetHours: Math.max(0, Math.min(24, parseFloat(e.target.value) || 0)) })}
            className="w-20 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 text-center"
          />
        </div>
        <div className="flex items-center justify-between gap-4 py-1">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-200">Pomodoro duration</p>
            <p className="text-xs text-zinc-500 mt-0.5">Length of each focus session in minutes.</p>
          </div>
          <input
            type="number"
            min={5}
            max={120}
            step={5}
            value={settings.productivity.pomodoroDuration}
            onChange={(e) => settings.updateProductivity({ pomodoroDuration: Math.max(5, Math.min(120, parseInt(e.target.value) || 25)) })}
            className="w-20 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 text-center"
          />
        </div>
        <ToggleSwitch
          enabled={settings.productivity.autoReset}
          onChange={(v) => settings.updateProductivity({ autoReset: v })}
          label="Auto-reset daily progress"
          description="Automatically reset progress hours at the start of each day."
        />
      </SettingsSection>

      {/* Academic */}
      <SettingsSection icon={GraduationCap} title="Academic" description="Manage your semester and study preferences.">
        <div className="flex items-center justify-between gap-4 py-1">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-200">Current semester</p>
            <p className="text-xs text-zinc-500 mt-0.5">Select your active semester for academic tracking.</p>
          </div>
          <select
            value={settings.academic.currentSemester || ''}
            onChange={(e) => settings.updateAcademic({ currentSemester: e.target.value || null })}
            className="w-40 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 appearance-none cursor-pointer"
          >
            <option value="" className="bg-zinc-800">Auto (active)</option>
            {semesters.map((sem) => (
              <option key={sem.id} value={sem.id} className="bg-zinc-800">{sem.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between gap-4 py-1">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-200">Default study category</p>
            <p className="text-xs text-zinc-500 mt-0.5">Category selected by default when adding tasks.</p>
          </div>
          <select
            value={settings.academic.defaultCategory}
            onChange={(e) => settings.updateAcademic({ defaultCategory: e.target.value })}
            className="w-40 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 appearance-none cursor-pointer"
          >
            <option value="all" className="bg-zinc-800">All categories</option>
            <option value="dsa" className="bg-zinc-800">DSA</option>
            <option value="semester" className="bg-zinc-800">Semester Study</option>
            <option value="projects" className="bg-zinc-800">Project Building</option>
            <option value="extra" className="bg-zinc-800">Extra Learning</option>
          </select>
        </div>
        <ToggleSwitch
          enabled={settings.academic.autoFocusWeak}
          onChange={(v) => settings.updateAcademic({ autoFocusWeak: v })}
          label="Auto-focus weak subjects"
          description="Prioritize subjects with lowest progress in suggestions."
        />
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection icon={Bell} title="Notifications" description="Configure reminders and alerts.">
        <ToggleSwitch
          enabled={settings.notifications.studyReminder}
          onChange={(v) => settings.updateNotifications({ studyReminder: v })}
          label="Study reminder"
          description="Get reminded to start your daily study session."
        />
        <ToggleSwitch
          enabled={settings.notifications.plannerReminder}
          onChange={(v) => settings.updateNotifications({ plannerReminder: v })}
          label="Planner reminder"
          description="Get reminded to plan your day each morning."
        />
        <div className="pt-2 pb-1">
          <p className="text-xs text-zinc-600 italic">
            Notification delivery requires Electron or PWA integration — placeholders ready for future release.
          </p>
        </div>
      </SettingsSection>

      {/* Data Management */}
      <SettingsSection icon={Database} title="Data Management" description="Export, import, or reset your data.">
        <div className="flex items-center justify-between gap-4 py-1">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-200">Export app data</p>
            <p className="text-xs text-zinc-500 mt-0.5">Download all your data as a JSON backup file.</p>
          </div>
          <Button variant="secondary" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
        {exportStatus && <p className="text-xs text-emerald-400 text-right">{exportStatus}</p>}

        <div className="flex items-center justify-between gap-4 py-1">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-200">Import app data</p>
            <p className="text-xs text-zinc-500 mt-0.5">Restore data from a previous backup file.</p>
          </div>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>
        {importStatus && (
          <p className={`text-xs text-right ${importStatus.includes('Invalid') ? 'text-red-400' : 'text-emerald-400'}`}>
            {importStatus}
          </p>
        )}

        <div className="flex items-center justify-between gap-4 py-1 pt-3 border-t border-zinc-800/30">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-red-400">Reset all data</p>
            <p className="text-xs text-zinc-500 mt-0.5">Permanently delete all tasks, progress, academic, and planner data.</p>
          </div>
          <Button variant="danger" onClick={() => setShowResetModal(true)}>
            <AlertTriangle className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </SettingsSection>

      {/* Reset Confirmation Modal */}
      <Modal isOpen={showResetModal} onClose={() => setShowResetModal(false)} title="Reset All Data">
        <div className="space-y-5">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-950/10 border border-red-900/20">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-300">This action cannot be undone</p>
              <p className="text-xs text-zinc-400 mt-1">
                All tasks, study progress, academic subjects, topics, planner items, and settings will be permanently deleted.
              </p>
            </div>
          </div>
          <p className="text-sm text-zinc-400">Consider exporting your data first if you want to keep a backup.</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowResetModal(false)} className="flex-1">Cancel</Button>
            <Button variant="danger" onClick={handleReset} className="flex-1">Delete Everything</Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
