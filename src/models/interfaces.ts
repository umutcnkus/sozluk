export interface WordDefinition {
    text: string;
}

export interface WordProperties {
    ozellik_id: string;
    tur: string;
    tam_adi: string;        // Full name (e.g., "isim" for noun)
    kisa_adi: string;       // Abbreviation (e.g., "a." for noun)
    ekno: string;
}

export interface Meaning {
    anlam_id: string;
    madde_id: string;
    anlam_sira: string;
    fiil: string;
    tipkes: string;
    anlam: string;          // The actual meaning/definition
    gos: string;
    ozelliklerListe: WordProperties[];
}

export interface LiteraryExample {
    ornek_id: string;
    anlam_id: string;
    ornek: string;          // Example sentence
    yazar_id: string;
    yazar: Array<{
        tam_adi: string;    // Author's full name
    }>;
}

export interface Proverb {
    madde_id: string;
    on_taki: string;
    madde: string;          // The proverb text itself
}

export interface WordData {
    madde_id: string;
    kac: string;
    kelime_no: string;
    cesit: string;
    anlam_gor: string;
    on_taki: string | null;
    madde: string;              // The word itself
    cesit_say: string;
    anlam_say: string;
    taki: string | null;
    cogul_mu: string;           // Is plural? "0" or "1"
    ozel_mi: string;            // Is proper noun? "0" or "1"
    lisan_kodu: string;
    lisan: string;              // Etymology/language origin
    telaffuz: string;           // Pronunciation
    birlesikler: string;        // Compound words (comma-separated)
    font: string | null;
    madde_duz: string;
    gosterim_tarihi: string | null;
    anlamlarListe: Meaning[];
    atasozu?: Proverb[];        // Turkish proverbs using this word
    orneklerListe?: LiteraryExample[];
}