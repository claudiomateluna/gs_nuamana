import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadToStorage } from '@/lib/storage-utils';
import { getRoleIds } from '@/lib/roles';
import { UNIT_IDS } from '@/lib/unit-constants';
import { toast } from 'sonner';
import type { Perfil } from '@/types';
import type { ProgresionObjetivo as ProgresionObjetivoBase, ProgresionAvance as ProgresionAvanceBase } from '@/types';
import type { CeremoniaConJoins, RadarSnapshotItem, NotificationPayload } from '@/types/progresion';

type ProgresionObjetivo = ProgresionObjetivoBase & { texto_terminal?: string; texto_infantil?: string }
type ProgresionAvance = ProgresionAvanceBase & { valor_dirigente?: number | null }

interface UseCeremoniasProps {
  perfil: Perfil;
  userPerfil: Perfil;
  isLeader: boolean;
  getRadarData: () => RadarSnapshotItem[];
  fetchDefaultProgresion: () => Promise<void>;
}

export function useCeremonias({
  perfil,
  userPerfil,
  isLeader,
  getRadarData,
  fetchDefaultProgresion,
}: UseCeremoniasProps) {
  const [ceremonias, setCeremonias] = useState<CeremoniaConJoins[]>([]);
  const [activeCeremonyType, setActiveCeremonyType] = useState<'etapa' | 'promesa' | 'paso' | null>(null);
  const [cNombreHito, setCNombreHito] = useState('');
  const [cCampamento, setCCampamento] = useState('');
  const [cLugar, setCLugar] = useState('');
  const [cFecha, setCFecha] = useState(new Date().toISOString().split('T')[0]);
  const [cFotoFile, setCFotoFile] = useState<File | null>(null);
  const [cPadrinoId, setCPadrinoId] = useState('');
  const [cMadrinaId, setCMadrinaId] = useState('');
  const [cLoading, setCLoading] = useState(false);
  const [availablePadrinos, setAvailablePadrinos] = useState<Pick<Perfil, 'id' | 'nombres' | 'apellidos'>[]>([]);
  const [activeCeremonyForMessage, setActiveCeremonyForMessage] = useState<CeremoniaConJoins | null>(null);
  const [farewellMessageText, setFarewellMessageText] = useState('');
  const [viewingReportCeremony, setViewingReportCeremony] = useState<CeremoniaConJoins | null>(null);
  const [reportObjectives, setReportObjectives] = useState<ProgresionObjetivo[]>([]);
  const [reportAvances, setReportAvances] = useState<ProgresionAvance[]>([]);
  const [inlineMessageTexts, setInlineMessageTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (activeCeremonyType === 'promesa') {
      setCNombreHito('Promesa');
      fetchAvailablePadrinos();
    } else if (activeCeremonyType === 'paso') {
      if (perfil.unidad_id === UNIT_IDS.MANADA) {
        setCNombreHito(perfil.sexo?.toLowerCase() === 'femenino' || perfil.sexo?.toLowerCase() === 'femenina' || perfil.sexo?.toLowerCase() === 'f' ? 'Paso a Compañía' : 'Paso a Tropa');
      } else if (perfil.unidad_id === UNIT_IDS.COMPANIA || perfil.unidad_id === UNIT_IDS.TROPA) {
        setCNombreHito('Paso a Avanzada');
      } else if (perfil.unidad_id === UNIT_IDS.AVANZADA) {
        setCNombreHito('Paso a Clan');
      } else if (perfil.unidad_id === UNIT_IDS.CLAN) {
        setCNombreHito('Egreso');
      }
    } else {
      setCNombreHito('');
    }
  }, [activeCeremonyType, perfil]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const openCeremonyIdParam = params.get('openCeremonyId');
      if (openCeremonyIdParam) {
        supabase
          .from('ceremonias')
          .select('*, perfil:perfil_id(nombres, apellidos)')
          .eq('id', openCeremonyIdParam)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setActiveCeremonyForMessage(data);
            }
          });
      }
    }
  }, []);

  const fetchCeremonias = useCallback(async () => {
    const { data, error } = await supabase
      .from('ceremonias')
      .select(`
        *,
        padrino:padrino_id(id, nombres, apellidos),
        madrina:madrina_id(id, nombres, apellidos),
        unidad_origen:unidad_origen_id(nombre),
        unidad_destino:unidad_destino_id(nombre),
        mensajes:ceremonia_mensajes(
          *,
          remitente:remitente_id(id, nombres, apellidos, rol_id)
        )
      `)
      .eq('perfil_id', perfil.id)
      .order('fecha', { ascending: false });
    if (!error) {
      setCeremonias(data || []);
    }
  }, [perfil.id]);

  const fetchAvailablePadrinos = useCallback(async () => {
    const { data, error } = await supabase
      .from('perfiles')
      .select('id, nombres, apellidos, rol_id')
      .order('nombres');
    if (!error) {
      setAvailablePadrinos(data || []);
    }
  }, []);

  const handleUploadPhoto = useCallback(async (file: File): Promise<string | null> => {
    try {
      const publicUrl = await uploadToStorage(file, 'ceremonias', '', {
        fileNamePrefix: `${perfil.id}_ceremonia`
      });
      return publicUrl;
    } catch (err: unknown) {
      toast.error('Error al subir la fotografía: ' + (err as Error).message);
      return null;
    }
  }, [perfil.id]);

  const handleCloseMessageModal = useCallback(() => {
    setActiveCeremonyForMessage(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('openCeremonyId');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const handleSaveCeremonia = useCallback(async () => {
    if (!isLeader) return;
    setCLoading(true);
    try {
      let finalFotoUrl = '';
      if (cFotoFile) {
        const uploadedUrl = await handleUploadPhoto(cFotoFile);
        if (uploadedUrl) finalFotoUrl = uploadedUrl;
      }

      const radarData = getRadarData();

      const payload: Record<string, unknown> = {
        perfil_id: perfil.id,
        tipo: activeCeremonyType,
        nombre_hito: cNombreHito,
        campamento: cCampamento || '',
        lugar: cLugar || '',
        fecha: cFecha || new Date().toISOString().split('T')[0],
        foto_url: finalFotoUrl || null,
        radar_snapshot: radarData,
      };

      const rawNotifications: NotificationPayload[] = [];

      if (activeCeremonyType === 'promesa') {
        payload.padrino_id = cPadrinoId || null;
        payload.madrina_id = cMadrinaId || null;

        if (cPadrinoId) {
          rawNotifications.push({
            perfil_id: cPadrinoId,
            mensaje: `Ceremonia de Promesa: Deja tu bendición/mensaje especial para tu ahijado(a) ${perfil.nombres}`,
            tipo: 'ceremonia_promesa',
            link_url: 'TEMPLATE_ID'
          });
        }
        if (cMadrinaId) {
          rawNotifications.push({
            perfil_id: cMadrinaId,
            mensaje: `Ceremonia de Promesa: Deja tu bendición/mensaje especial para tu ahijado(a) ${perfil.nombres}`,
            tipo: 'ceremonia_promesa',
            link_url: 'TEMPLATE_ID'
          });
        }

        const { data: partners } = await supabase
          .from('perfiles')
          .select('id')
          .eq('unidad_id', perfil.unidad_id)
          .in('rol_id', [...getRoleIds('directivos'), ...getRoleIds('nnj')])
          .neq('id', perfil.id);

        if (partners && partners.length > 0) {
          partners.forEach(p => {
            rawNotifications.push({
              perfil_id: p.id,
              mensaje: `¡Promesa Scout! Deja tus bendiciones/mensajes para ${perfil.nombres} por su Ceremonia de Promesa`,
              tipo: 'ceremonia_promesa',
              link_url: 'TEMPLATE_ID'
            });
          });
        }
      }

      if (activeCeremonyType === 'paso') {
        let destUnidadId = perfil.unidad_id;
        let destRolId = perfil.rol_id;
        let destEtapaId: number | null = null;

        if (perfil.unidad_id === 1) { // Manada
          if (perfil.sexo?.toLowerCase() === 'femenino' || perfil.sexo?.toLowerCase() === 'femenina' || perfil.sexo?.toLowerCase() === 'f') {
            destUnidadId = 2; // Compañía
            destRolId = 10; // Guía
            destEtapaId = 38; // Alba
          } else {
            destUnidadId = 3; // Tropa
            destRolId = 11; // Scout
            destEtapaId = 42; // Cernícalo
          }
        } else if (perfil.unidad_id === UNIT_IDS.COMPANIA || perfil.unidad_id === UNIT_IDS.TROPA) {
          destUnidadId = UNIT_IDS.AVANZADA; // Avanzada
          destRolId = 12; // Pionero
          destEtapaId = 46; // Sendero
        } else if (perfil.unidad_id === UNIT_IDS.AVANZADA) {
          destUnidadId = UNIT_IDS.CLAN; // Clan
          destRolId = 13; // Caminante
          destEtapaId = 48; // Fuego
        }

        payload.unidad_origen_id = perfil.unidad_id;
        payload.unidad_destino_id = destUnidadId;

        const { error: profileError } = await supabase
          .from('perfiles')
          .update({
            unidad_id: destUnidadId,
            rol_id: destRolId,
            progresion_etapa_id: destEtapaId
          })
          .eq('id', perfil.id);

        if (profileError) throw profileError;

        const { data: partners } = await supabase
          .from('perfiles')
          .select('id')
          .eq('unidad_id', perfil.unidad_id)
          .in('rol_id', [...getRoleIds('directivos'), ...getRoleIds('nnj')])
          .neq('id', perfil.id);

        if (partners && partners.length > 0) {
          partners.forEach(p => {
            rawNotifications.push({
              perfil_id: p.id,
              mensaje: `Ceremonia de Paso: Deja tu mensaje de despedida para ${perfil.nombres}`,
              tipo: 'ceremonia_paso',
              link_url: 'TEMPLATE_ID'
            });
          });
        }
      }

      if (activeCeremonyType === 'etapa') {
        const { data: partners } = await supabase
          .from('perfiles')
          .select('id')
          .eq('unidad_id', perfil.unidad_id)
          .in('rol_id', [...getRoleIds('directivos'), ...getRoleIds('nnj')])
          .neq('id', perfil.id);

        if (partners && partners.length > 0) {
          partners.forEach(p => {
            rawNotifications.push({
              perfil_id: p.id,
              mensaje: `¡Nueva Etapa! Deja tus felicitaciones para ${perfil.nombres} por alcanzar la etapa ${cNombreHito}`,
              tipo: 'ceremonia_etapa',
              link_url: 'TEMPLATE_ID'
            });
          });
        }
      }

      // Deduplicate rawNotifications by perfil_id
      const uniqueNotifications: NotificationPayload[] = [];
      const seenIds = new Set<string>();
      for (const notif of rawNotifications) {
        if (!seenIds.has(notif.perfil_id)) {
          seenIds.add(notif.perfil_id);
          uniqueNotifications.push(notif);
        }
      }

      const { data: insertedCeremonia, error: ceremonyErr } = await supabase
        .from('ceremonias')
        .insert([payload])
        .select()
        .single();

      if (ceremonyErr) throw ceremonyErr;

      if (uniqueNotifications.length > 0 && insertedCeremonia) {
        const finalNotifications = uniqueNotifications.map((n: NotificationPayload) => ({
          ...n,
          link_url: `/panel?openCeremonyId=${insertedCeremonia.id}`
        }));
        await supabase.from('notificaciones').insert(finalNotifications);
      }

      await supabase.from('progresion_hitos').insert([{
        perfil_id: perfil.id,
        nombre_hito: cNombreHito,
        fecha_entrega: payload.fecha,
        tipo: activeCeremonyType,
        entregado_por: userPerfil.id
      }]);

      if (activeCeremonyType === 'etapa') {
        const stageMap: Record<string, number> = {
          'Lobezno': 1, 'Saltador': 2, 'Diestro': 3, 'Cazador': 4,
          'Alba': 38, 'Amanecer': 39, 'Luz': 40, 'Resplandor': 41,
          'Cernícalo': 42, 'Halcón': 43, 'Águila': 44, 'Cóndor': 45,
          'Sendero': 46, 'Cumbre': 47,
          'Fuego': 48, 'Antorcha': 49
        };
        const matchingStageId = stageMap[cNombreHito];
        if (matchingStageId) {
          await supabase.from('perfiles').update({
            progresion_etapa_id: matchingStageId
          }).eq('id', perfil.id);
        }
      }

      toast.success('¡Ceremonia registrada con éxito!');
      setActiveCeremonyType(null);
      setCNombreHito('');
      setCCampamento('');
      setCLugar('');
      setCFotoFile(null);
      setCPadrinoId('');
      setCMadrinaId('');

      await fetchCeremonias();
      await fetchDefaultProgresion();
    } catch (err: unknown) {
      console.error(err);
      toast.error('Error al registrar ceremonia: ' + (err as Error).message);
    } finally {
      setCLoading(false);
    }
  }, [
    isLeader, cFotoFile, activeCeremonyType, cNombreHito, cCampamento, cLugar,
    cFecha, cPadrinoId, cMadrinaId, perfil, userPerfil, getRadarData,
    handleUploadPhoto, fetchCeremonias, fetchDefaultProgresion
  ]);

  const handleSaveCeremonyMessage = useCallback(async () => {
    if (!activeCeremonyForMessage || !farewellMessageText.trim()) return;
    try {
      const { error } = await supabase
        .from('ceremonia_mensajes')
        .insert([{
          ceremonia_id: activeCeremonyForMessage.id,
          remitente_id: userPerfil.id,
          mensaje: farewellMessageText.trim()
        }]);
      if (error) throw error;

      toast.success('¡Mensaje enviado con éxito!');
      setFarewellMessageText('');
      handleCloseMessageModal();
      await fetchCeremonias();
    } catch (err: unknown) {
      console.error(err);
      toast.error('Error al guardar mensaje: ' + (err as Error).message);
    }
  }, [activeCeremonyForMessage, farewellMessageText, userPerfil.id, handleCloseMessageModal, fetchCeremonias]);

  const handleSaveInlineMessage = useCallback(async (ceremonyId: string) => {
    const msg = inlineMessageTexts[ceremonyId]?.trim();
    if (!msg) return;
    try {
      const { error } = await supabase
        .from('ceremonia_mensajes')
        .insert([{
          ceremonia_id: ceremonyId,
          remitente_id: userPerfil.id,
          mensaje: msg
        }]);
      if (error) throw error;

      setInlineMessageTexts(prev => ({ ...prev, [ceremonyId]: '' }));
      toast.success('¡Mensaje guardado con éxito!');
      await fetchCeremonias();
    } catch (err: unknown) {
      toast.error('Error al guardar mensaje: ' + (err as Error).message);
    }
  }, [inlineMessageTexts, userPerfil.id, fetchCeremonias]);

  const handleViewReport = useCallback(async (ceremony: CeremoniaConJoins) => {
    setViewingReportCeremony(ceremony);
    const { data: objs } = await supabase
      .from('progresion_objetivos')
      .select('*')
      .eq('unidad_id', ceremony.unidad_origen_id);
    const { data: avs } = await supabase
      .from('progresion_avance')
      .select('*')
      .eq('perfil_id', perfil.id);
    setReportObjectives(objs || []);
    setReportAvances(avs || []);
  }, [perfil.id]);

  const getStageOptionsForDropdown = useCallback(() => {
    if (perfil.unidad_id === UNIT_IDS.MANADA) return ['Lobezno', 'Saltador', 'Diestro', 'Cazador'];
    if (perfil.unidad_id === UNIT_IDS.COMPANIA) return ['Alba', 'Amanecer', 'Luz', 'Resplandor'];
    if (perfil.unidad_id === UNIT_IDS.TROPA) return ['Cernícalo', 'Halcón', 'Águila', 'Cóndor'];
    if (perfil.unidad_id === UNIT_IDS.AVANZADA) return ['Cruz del Sur (Bienvenida)', 'Sendero', 'Cumbre'];
    if (perfil.unidad_id === UNIT_IDS.CLAN) return ['Insignia del Caminante (Bienvenida)', 'Fuego', 'Antorcha', 'Egreso'];
    return [];
  }, [perfil.unidad_id]);

  return {
    ceremonias,
    activeCeremonyType,
    cNombreHito,
    cCampamento,
    cLugar,
    cFecha,
    cFotoFile,
    cPadrinoId,
    cMadrinaId,
    cLoading,
    availablePadrinos,
    activeCeremonyForMessage,
    farewellMessageText,
    viewingReportCeremony,
    reportObjectives,
    reportAvances,
    inlineMessageTexts,

    setActiveCeremonyType,
    setCNombreHito,
    setCCampamento,
    setCLugar,
    setCFecha,
    setCFotoFile,
    setCPadrinoId,
    setCMadrinaId,
    setActiveCeremonyForMessage,
    setFarewellMessageText,
    setViewingReportCeremony,
    setInlineMessageTexts,

    fetchCeremonias,
    fetchAvailablePadrinos,
    handleSaveCeremonia,
    handleSaveCeremonyMessage,
    handleSaveInlineMessage,
    handleViewReport,
    handleCloseMessageModal,
    getStageOptionsForDropdown,
  };
}
