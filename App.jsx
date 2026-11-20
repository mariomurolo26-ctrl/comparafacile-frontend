import { useState } from 'react';

function App() {
  const [tipoPratica, setTipoPratica] = useState('Switch');
  const [tipoCliente, setTipoCliente] = useState('privato');
  const [tipoFornitura, setTipoFornitura] = useState('duale');
  
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [codiceFiscale, setCodiceFiscale] = useState('');
  const [ragioneSociale, setRagioneSociale] = useState('');
  const [partitaIva, setPartitaIva] = useState('');

  const [residenza, setResidenza] = useState('');
  const [luogoFornitura, setLuogoFornitura] = useState('');
  const [isStessaResidenza, setIsStessaResidenza] = useState(true);
  const [pod, setPod] = useState('');
  const [pdr, setPdr] = useState('');

  const [risultati, setRisultati] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successo, setSuccesso] = useState(false);
  const [errore, setErrore] = useState(null);

  const gestisciInvio = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrore(null);
    setRisultati(null);

    const datiUtente = {
      tipo_pratica: tipoPratica,
      tipo_cliente: tipoCliente,
      tipo_fornitura: tipoFornitura,
      nome, cognome, email, telefono, codice_fiscale: codiceFiscale,
      ragione_sociale: ragioneSociale, partita_iva: partitaIva,
      residenza: residenza,
      luogo_fornitura: isStessaResidenza ? residenza : luogoFornitura,
      pod: pod, pdr: pdr
    };

    try {
      const risposta = await fetch('https://comparafacile-backend.onrender.com/confronta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datiUtente),
      });
      const dati = await risposta.json();
      setRisultati(dati.risultati);
    } catch (error) {
      setErrore("Il server ci sta mettendo troppo tempo a svegliarsi. Riprova tra 30 secondi.");
    } finally {
      setLoading(false);
    }
  };

  const inviaScelta = async (offerta) => {
    setLoading(true);
    setErrore(null);
    
    const payload = {
      tipo_pratica: tipoPratica, tipo_cliente: tipoCliente, tipo_fornitura: tipoFornitura,
      nome, cognome, email, telefono, codice_fiscale: codiceFiscale,
      ragione_sociale: ragioneSociale, partita_iva: partitaIva,
      residenza: residenza,
      luogo_fornitura: isStessaResidenza ? residenza : luogoFornitura,
      pod: pod, pdr: pdr,
      offerta_scelta: `${offerta.fornitore} - ${offerta.offerta}`
    };

    try {
      const response = await fetch('https://bqyyhpmxatvuxvlnwdwp.supabase.co/rest/v1/lead_scelte', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxeXlocG14YXZ0dXZ4bG5vd2RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NTA5NTc1OCwiZXhwIjoyMTEwNjcxNzU4fQ.Jgdn4QNHBJEwCD-A1jInJtOG5D-8OxRJRzbjKPI7o6E',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxeXlocG14YXZ0dXZ4bG5vd2RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NTA5NTc1OCwiZXhwIjoyMTEwNjcxNzU4fQ.Jgdn4QNHBJEwCD-A1jInJtOG5D-8OxRJRzbjKPI7o6E',
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccesso(true);
        setRisultati(null);
      } else {
        const erroreDettaglio = await response.text();
        console.error("Errore Supabase:", erroreDettaglio);
        setErrore("Errore salvataggio DB. Controlla la console. " + erroreDettaglio);
      }
    } catch (error) {
      setErrore("Errore di connessione al database.");
    } finally {
      setLoading(false);
    }
  };

  const s = {
    body: { background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' },
    nav: { backgroundColor: '#ffffff', padding: '15px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '10px' },
    logoText: { fontSize: '22px', fontWeight: '800', color: '#111827', margin: 0 },
    logoDot: { color: '#10b981' }, // Verde smeraldo
    mainContainer: { flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 20px' },
    card: { width: '100%', maxWidth: '750px', backgroundColor: '#ffffff', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', padding: '40px', boxSizing: 'border-box' },
    title: { fontSize: '28px', fontWeight: '800', color: '#111827', marginTop: 0, marginBottom: '8px', textAlign: 'center' },
    subtitle: { fontSize: '16px', color: '#6b7280', marginTop: 0, marginBottom: '32px', textAlign: 'center' },
    sectionTitle: { fontSize: '13px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', marginTop: '30px', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' },
    inputGroup: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
    input: { width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '15px', color: '#111827', boxSizing: 'border-box', backgroundColor: '#f9fafb', outline: 'none', transition: 'border 0.2s' },
    row: { display: 'flex', gap: '16px' },
    col: { flex: 1 },
    checkboxGroup: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', cursor: 'pointer' },
    btnPrimary: { width: '100%', padding: '18px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '24px', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' },
    // Stili per la tabella/card delle offerte
    offerCard: { border: '2px solid #f3f4f6', borderRadius: '16px', padding: '20px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s', backgroundColor: '#fff' },
    offerBest: { border: '2px solid #10b981', backgroundColor: '#f0fdf4', position: 'relative' },
    badgeBest: { position: 'absolute', top: '-12px', left: '20px', backgroundColor: '#10b981', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    btnScegli: { backgroundColor: '#111827', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
    successBox: { textAlign: 'center', padding: '40px 20px' },
    successIcon: { width: '80px', height: '80px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' },
    error: { backgroundColor: '#fef2f2', color: '#b91c1c', padding: '16px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px', border: '1px solid #fecaca', fontWeight: '500' },
    radioGroup: { display: 'flex', gap: '20px', marginBottom: '20px', backgroundColor: '#f9fafb', padding: '15px', borderRadius: '10px' },
    radioLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', color: '#374151' }
  };

  return (
    <div style={s.body}>
      <nav style={s.nav}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#10b981" />
        </svg>
        <h1 style={s.logoText}>Compara<span style={s.logoDot}>Facile</span></h1>
      </nav>

      <div style={s.mainContainer}>
        <div style={s.card}>
          {errore && <div style={s.error}>{errore}</div>}

          {successo ? (
            <div style={s.successBox}>
              <div style={s.successIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h2 style={{...s.title, color: '#065f46'}}>Richiesta Ricevuta!</h2>
              <p style={{ color: '#6b7280', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                Grazie <strong>{tipoCliente === 'azienda' ? ragioneSociale : nome}</strong>,<br/>
                abbiamo registrato la tua richiesta di <strong>{tipoPratica}</strong>.<br/>
                Un nostro consulente ti contatterà <strong>entro 48 ore</strong>.
              </p>
              <button onClick={() => window.location.reload()} style={{...s.btnPrimary, backgroundColor: '#111827', boxShadow: 'none'}}>Torna alla home</button>
            </div>
          ) : (
            <>
              <h2 style={s.title}>Confronta le offerte</h2>
              <p style={s.subtitle}>Scopri in 1 minuto come risparmiare su luce, gas e fibra.</p>

              <form onSubmit={gestisciInvio}>
                <div style={s.sectionTitle}>1. Cosa devi fare?</div>
                <div style={s.inputGroup}>
                  <select style={s.input} value={tipoPratica} onChange={(e) => setTipoPratica(e.target.value)}>
                    <option value="Switch">Switch (Cambio Fornitore)</option>
                    <option value="Nuova Attivazione">Nuova Attivazione (Allaccio)</option>
                    <option value="Subentro">Subentro (Casa disabitata)</option>
                    <option value="Voltura">Voltura (Cambio Intestatario)</option>
                  </select>
                </div>

                <div style={s.sectionTitle}>2. Tipo di Cliente</div>
                <div style={s.radioGroup}>
                  <label style={s.radioLabel}>
                    <input type="radio" value="privato" checked={tipoCliente === 'privato'} onChange={() => setTipoCliente('privato')} />
                    Privato
                  </label>
                  <label style={s.radioLabel}>
                    <input type="radio" value="azienda" checked={tipoCliente === 'azienda'} onChange={() => setTipoCliente('azienda')} />
                    Azienda / Partita IVA
                  </label>
                </div>

                <div style={s.sectionTitle}>3. Dati Anagrafici</div>
                {tipoCliente === 'azienda' ? (
                  <div style={s.row}>
                    <div style={{...s.inputGroup, ...s.col}}>
                      <label style={s.label}>Ragione Sociale</label>
                      <input type="text" style={s.input} value={ragioneSociale} onChange={(e) => setRagioneSociale(e.target.value)} required />
                    </div>
                    <div style={{...s.inputGroup, ...s.col}}>
                      <label style={s.label}>Partita IVA</label>
                      <input type="text" style={s.input} value={partitaIva} onChange={(e) => setPartitaIva(e.target.value)} required />
                    </div>
                  </div>
                ) : (
                  <div style={s.row}>
                    <div style={{...s.inputGroup, ...s.col}}>
                      <label style={s.label}>Nome</label>
                      <input type="text" style={s.input} value={nome} onChange={(e) => setNome(e.target.value)} required />
                    </div>
                    <div style={{...s.inputGroup, ...s.col}}>
                      <label style={s.label}>Cognome</label>
                      <input type="text" style={s.input} value={cognome} onChange={(e) => setCognome(e.target.value)} required />
                    </div>
                  </div>
                )}

                <div style={s.row}>
                  <div style={{...s.inputGroup, ...s.col}}>
                    <label style={s.label}>Email</label>
                    <input type="email" style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div style={{...s.inputGroup, ...s.col}}>
                    <label style={s.label}>Cellulare</label>
                    <input type="tel" style={s.input} value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                  </div>
                </div>

                <div style={s.row}>
                  {tipoCliente === 'privato' && (
                    <div style={{...s.inputGroup, ...s.col}}>
                      <label style={s.label}>Codice Fiscale</label>
                      <input type="text" style={s.input} value={codiceFiscale} onChange={(e) => setCodiceFiscale(e.target.value)} required />
                    </div>
                  )}
                  <div style={{...s.inputGroup, ...s.col}}>
                    <label style={s.label}>Indirizzo Sede/Residenza</label>
                    <input type="text" style={s.input} value={residenza} onChange={(e) => setResidenza(e.target.value)} placeholder="Via, Civico, Città" required />
                  </div>
                </div>

                <div style={s.sectionTitle}>4. Dettagli Fornitura</div>
                <div style={s.inputGroup}>
                  <label style={s.label}>Cosa vuoi confrontare?</label>
                  <select style={s.input} value={tipoFornitura} onChange={(e) => setTipoFornitura(e.target.value)}>
                    <option value="luce">Solo Luce</option>
                    <option value="gas">Solo Gas</option>
                    <option value="duale">Luce + Gas (Dual Fuel)</option>
                    <option value="fibra">Fibra Internet</option>
                  </select>
                </div>

                {tipoFornitura !== 'fibra' && (
                  <>
                    <div style={s.checkboxGroup} onClick={() => setIsStessaResidenza(!isStessaResidenza)}>
                      <input type="checkbox" checked={isStessaResidenza} onChange={() => {}} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                      <label style={{...s.label, marginBottom: 0, cursor: 'pointer'}}>Il luogo di fornitura coincide con la sede/residenza</label>
                    </div>

                    {!isStessaResidenza && (
                      <div style={s.inputGroup}>
                        <label style={s.label}>Indirizzo Luogo di Fornitura</label>
                        <input type="text" style={s.input} value={luogoFornitura} onChange={(e) => setLuogoFornitura(e.target.value)} placeholder="Via, Civico, Città" required />
                      </div>
                    )}

                    <div style={s.row}>
                      {(tipoFornitura === 'luce' || tipoFornitura === 'duale') && (
                        <div style={{...s.inputGroup, ...s.col}}>
                          <label style={s.label}>Codice POD (opzionale)</label>
                          <input type="text" style={s.input} value={pod} onChange={(e) => setPod(e.target.value)} placeholder="IT001E..." />
                        </div>
                      )}
                      {(tipoFornitura === 'gas' || tipoFornitura === 'duale') && (
                        <div style={{...s.inputGroup, ...s.col}}>
                          <label style={s.label}>Codice PDR (opzionale)</label>
                          <input type="text" style={s.input} value={pdr} onChange={(e) => setPdr(e.target.value)} placeholder="01234567890..." />
                        </div>
                      )}
                    </div>
                  </>
                )}

                <button type="submit" disabled={loading} style={s.btnPrimary}>
                  {loading ? 'Ricerca in corso...' : 'Confronta Offerte Gratis'}
                </button>
              </form>

              {/* LISTA OFFERTE (Nuovo Stile a Card) */}
              {risultati && (
                <div style={{ marginTop: '40px' }}>
                  <h3 style={{ fontSize: '20px', color: '#111827', marginBottom: '20px', textAlign: 'center' }}>Le migliori offerte per te</h3>
                  
                  {risultati.map((offerta, indice) => (
                    <div key={indice} style={indice === 0 ? {...s.offerCard, ...s.offerBest} : s.offerCard}>
                      {indice === 0 && <div style={s.badgeBest}>MIGLIORE OFFERTA</div>}
                      
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#111827' }}>{offerta.fornitore}</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{offerta.offerta}</p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '18px', fontWeight: '800', color: '#059669' }}>{offerta.prezzo1}</div>
                          {tipoFornitura !== 'fibra' && <div style={{ fontSize: '14px', color: '#6b7280' }}>{offerta.prezzo2}</div>}
                        </div>
                        <button onClick={() => inviaScelta(offerta)} style={s.btnScegli}>Scegli</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
