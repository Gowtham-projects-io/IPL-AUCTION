import React, { useState } from 'react';
import { 
  Settings, Upload, FileSpreadsheet, RotateCcw, CheckCircle2, 
  AlertCircle, Edit, Save, ShieldAlert, Sparkles 
} from 'lucide-react';
import { api } from '../services/api';

export const AdminDashboardPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [importMode, setImportMode] = useState('mega');
  const [importResult, setImportResult] = useState(null);
  const [importing, setImporting] = useState(false);

  // Quick Player Editor state
  const [playerId, setPlayerId] = useState('IPL27-MEGA-001');
  const [newBasePrice, setNewBasePrice] = useState('200');
  const [newSet, setNewSet] = useState('M1');
  const [newAvailability, setNewAvailability] = useState('Available');
  const [editStatus, setEditStatus] = useState(null);

  // Demo Reset state
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setImportResult(null);
    }
  };

  const handleUploadCsv = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setImporting(true);
    setImportResult(null);
    try {
      const res = await api.importCsv(selectedFile, importMode);
      setImportResult(res);
    } catch (err) {
      setImportResult({ success: false, errors: [err.message || 'Upload failed'] });
    } finally {
      setImporting(false);
    }
  };

  const handleUpdatePlayer = async (e) => {
    e.preventDefault();
    setEditStatus(null);
    try {
      await api.updatePlayer(playerId, {
        base_price_lakh: parseInt(newBasePrice),
        auction_set: newSet,
        availability: newAvailability
      });
      setEditStatus({ success: true, message: `Player ${playerId} updated successfully.` });
    } catch (err) {
      setEditStatus({ success: false, message: err.message || 'Failed to update player.' });
    }
  };

  const handleResetDemo = async () => {
    if (!window.confirm('Are you sure you want to purge demo auction rooms and re-seed official IPL 2027 defaults?')) {
      return;
    }
    setResetting(true);
    setResetMessage(null);
    try {
      const res = await api.resetDemo();
      setResetMessage({ success: true, message: res.message });
    } catch (err) {
      setResetMessage({ success: false, message: err.message || 'Reset failed.' });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-mint-glacier/30 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-mint-glacier font-bold uppercase tracking-wider mb-2">
            <Settings className="w-4 h-4" />
            <span>IPL 2027 Control Center</span>
          </div>
          <h2 className="font-display font-black text-3xl text-silver-soft uppercase tracking-wide">
            ADMINISTRATOR DASHBOARD
          </h2>
          <p className="text-xs sm:text-sm text-mist-grey">
            Manage player rosters, import custom CSV registries, configure reserve prices, and maintain season data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CSV Import Tool */}
        <div className="glass-card rounded-2xl p-6 border border-teal-border/60">
          <div className="flex items-center gap-2 mb-4">
            <FileSpreadsheet className="w-5 h-5 text-mint-glacier" />
            <h3 className="font-display font-extrabold text-xl text-silver-soft uppercase">
              CSV Player Import & Validation
            </h3>
          </div>
          <p className="text-xs text-mist-grey mb-4">
            Upload custom CSV files to import or update player auction pools. The validator automatically inspects mandatory columns, roles, and base prices.
          </p>

          <form onSubmit={handleUploadCsv} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-silver-soft block mb-1.5 uppercase">
                Target Auction Pool
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setImportMode('mega')}
                  className={`py-2 rounded-lg text-xs font-bold uppercase border transition-all ${
                    importMode === 'mega'
                      ? 'bg-mint-glacier text-fjord-950 border-mint-glacier'
                      : 'bg-teal-panel text-silver-soft border-teal-border'
                  }`}
                >
                  Mega Auction
                </button>
                <button
                  type="button"
                  onClick={() => setImportMode('mini')}
                  className={`py-2 rounded-lg text-xs font-bold uppercase border transition-all ${
                    importMode === 'mini'
                      ? 'bg-cyan-400 text-fjord-950 border-cyan-400'
                      : 'bg-teal-panel text-silver-soft border-teal-border'
                  }`}
                >
                  Mini Auction
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-silver-soft block mb-1.5 uppercase">
                Choose CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full text-xs text-silver-soft file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-panel file:text-mint-glacier file:font-bold hover:file:bg-teal-hover cursor-pointer"
                required
              />
            </div>

            <button
              type="submit"
              disabled={importing || !selectedFile}
              className={`w-full py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                !selectedFile || importing
                  ? 'bg-teal-panel text-mist-grey cursor-not-allowed'
                  : 'bg-mint-glacier hover:bg-mint-hover text-fjord-950 shadow-md mint-glow-sm'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>{importing ? 'Validating & Importing...' : 'Validate & Import CSV'}</span>
            </button>
          </form>

          {/* Validation Feedback */}
          {importResult && (
            <div className={`mt-4 p-3 rounded-xl border text-xs ${
              importResult.success
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/40 border-red-500/40 text-red-200'
            }`}>
              {importResult.success ? (
                <div>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Import Succeeded!</span>
                  </div>
                  <p>{importResult.message}</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>CSV Validation Errors:</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1">
                    {(importResult.errors || []).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Player Attributes Editor */}
        <div className="glass-card rounded-2xl p-6 border border-teal-border/60">
          <div className="flex items-center gap-2 mb-4">
            <Edit className="w-5 h-5 text-mint-glacier" />
            <h3 className="font-display font-extrabold text-xl text-silver-soft uppercase">
              Player Base Price & Set Editor
            </h3>
          </div>
          <p className="text-xs text-mist-grey mb-4">
            Adjust official base prices or auction set designations for any player in the registry.
          </p>

          <form onSubmit={handleUpdatePlayer} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-silver-soft block mb-1 uppercase">
                Player ID
              </label>
              <input
                type="text"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                placeholder="e.g. IPL27-MEGA-001"
                className="w-full bg-fjord-950 text-silver-soft text-xs rounded-xl px-3 py-2 border border-teal-border focus:border-mint-glacier outline-none font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-silver-soft block mb-1 uppercase">
                  Base Price (₹ Lakh)
                </label>
                <input
                  type="number"
                  value={newBasePrice}
                  onChange={(e) => setNewBasePrice(e.target.value)}
                  className="w-full bg-fjord-950 text-silver-soft text-xs rounded-xl px-3 py-2 border border-teal-border focus:border-mint-glacier outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-silver-soft block mb-1 uppercase">
                  Auction Set
                </label>
                <input
                  type="text"
                  value={newSet}
                  onChange={(e) => setNewSet(e.target.value.toUpperCase())}
                  className="w-full bg-fjord-950 text-silver-soft text-xs rounded-xl px-3 py-2 border border-teal-border focus:border-mint-glacier outline-none font-mono uppercase"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-silver-soft block mb-1 uppercase">
                Availability
              </label>
              <select
                value={newAvailability}
                onChange={(e) => setNewAvailability(e.target.value)}
                className="w-full bg-fjord-950 text-silver-soft text-xs rounded-xl px-3 py-2 border border-teal-border focus:border-mint-glacier outline-none"
              >
                <option value="Available">Available for Auction</option>
                <option value="Injured">Injured / Withdrawn</option>
                <option value="Unconfirmed">Unconfirmed</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal-panel hover:bg-teal-hover text-mint-glacier border border-mint-glacier/30 font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Update Player Attributes</span>
            </button>
          </form>

          {editStatus && (
            <div className={`mt-4 p-3 rounded-xl border text-xs ${
              editStatus.success ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-red-950/40 border-red-500/40 text-red-200'
            }`}>
              {editStatus.message}
            </div>
          )}
        </div>

      </div>

      {/* Maintenance & Demo Reset */}
      <div className="glass-panel rounded-2xl p-6 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-display font-bold text-lg text-red-300 uppercase flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-red-400" />
            <span>Reset Demo Auction Database</span>
          </h4>
          <p className="text-xs text-mist-grey max-w-lg mt-1">
            Purges mock auction rooms, resets team wallets to ₹120.00 Cr, and re-seeds clean official BCCI 2027 presets.
          </p>
        </div>

        <button
          onClick={handleResetDemo}
          disabled={resetting}
          className="px-5 py-2.5 rounded-xl bg-red-950 hover:bg-red-900 border border-red-500/50 text-red-200 text-xs font-bold uppercase tracking-wider transition-all shrink-0"
        >
          {resetting ? 'Resetting...' : 'Reset Demo Arena'}
        </button>
      </div>

      {resetMessage && (
        <div className={`p-4 rounded-xl border text-xs ${
          resetMessage.success ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-red-950/40 border-red-500/40 text-red-200'
        }`}>
          {resetMessage.message}
        </div>
      )}

    </div>
  );
};
