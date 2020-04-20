
import chalk from "chalk";
let startCodon: codon = "ATG";
let considerStartCodon = true;

export const refSeq="ATGAATATTGCAAAATTATTAGGAGTTATTTCATTTATTTGTTGGATAGTAGCATGTGTTTTAACTATCTGTATCGATGCTAGCAGTGTGTTTTCACAAGCTTTAGCCCAGGGTATGTGTGCATATTTAACATTTGTGTTGTTATCTAATGATTAA";
export const seq1 = "ATGAATATTGCAAAATTATTAGGAGTTATTTCATTTATTTGTTGGATAGTAGCATGTGTTTTAACTATCTGTATTGATGCCAGCAGTGTGTTTTCGCAAGCTTTAGCTCAGGGTATGTGTGCATATTTAACATTTGTGTTGTTATCTACTAATGATTAA";
export const seq2 = "ATGAATATCGCAAAATTATTAGGAATTATTTCATTTATTTGTTGGATAGTAGCATGTGTTTTAACTATCTGTATTGATGCCAGCAGTGTGTTTTCACAAGCTTTAGCCCAGGGTATGTGTGCATATTTAACATTTGTGTTGTTATCTACTAATGATTAA";
export const seq3 = "ATGAATACTGCAAAAATTATTGGAATTATTTCATTTATTTGTTGGATAGTAGCATGTATTTTAACTATCTGTATCGATGTCAGTAGTGTGTTTTCACAGGCTTTAGCCCAGGGTATGTGTGCATATTTAACATTTGTGTTGTTATCTAATGATTAA";
export const seq4 = "ATGAATATTGCAAAATTATTAGGAGTTATTTCATTTATTTGTTGGATAGTAGCATGTGTTTTAACTATCGTATCGATGCTAGCAGTGTGTTTTCACAAGCTTTAGCCCAGGGTATGTGTGCATATTTAACATTTGTGTTGTTATCTAATGATTAA";
export const seq5 = "ATGAATATTGCAAAATTATTAGGAGTTATTTCATTTATTTGTTGGATAGTAGCATGTGTTTTAACTATCTGTATCGATGCTAGCAGTGTGTATTTCACAAGCTTTAGCCCAGGGTATGTGTGCATATTTAACATTTGTGTTGTTATCTAATGATTAA";


const refSeqModified1  = "ATGAATATTGCAAAATTATTAGGAGTTATTTCATTTATTTGTTGGATAGTAGCATGTGTTTTAACTATCTGTATCGATGCTAGCAGTGTGTTTTCACAAGCTTTAGCCCAGGGTATGTGTGCATATTTAACATTTGTGTTGTTATCTAAT   GATTAA";
const refSeqModified2  = "ATGAATATTGCAAAATTATTAGGAGTTATTTCATTTATTTGTTGGATAGTAGCATGTGTTTTAACTATCTGTATCGATGCTAGCAGTGTGTTTTCACAAGCTTTAGCCCAGGGTATGTGTGCATATTTAACATTTGTGTTGTTAT   CTAATGATTAA";
const refSeqModified5  = "ATGAATATTGCAAAATTATTAGGAGTTATTTCATTTATTTGTTGGATAGTAGCATGTGTTTTAACTATCTGTATCGATGCTAGCAGTGTGT TTTCACAAGCTTTAGCCCAGGGTATGTGTGCATATTTAACATTTGTGTTGTTATCTAATGATTAA";
const seq4Modified = "ATGAATATTGCAAAATTATTAGGAGTTATTTCATTTATTTGTTGGATAGTAGCATGTGTTTTAACTATC GTATCGATGCTAGCAGTGTGTTTTCACAAGCTTTAGCCCAGGGTATGTGTGCATATTTAACATTTGTGTTGTTATCTAATGATTAA"

export function doEverything(){
    let refSeqTranslation = translate(refSeq);
    let seq1Translation = translate(seq1);
    let seq2Translation = translate(seq2);
    let seq3Translation = translate(seq3);
    let seq4Translation = translate(seq4);
    let seq5Translation = translate(seq5);
    console.log(chalk.green("ref seq: "));
    console.log("translation: ", refSeqTranslation)
    console.log(chalk.green("seq 1: "));
    console.log("translation: ", seq1Translation)
    console.log(chalk.cyan("DNA differences: ", countDifferences(refSeqModified1,seq1)));
    console.log(chalk.cyan("Protein differences: ", countDifferences(refSeqTranslation,seq1Translation)));
    console.log(chalk.green("seq 2: "));
    console.log("translation: ", seq2Translation)
    console.log(chalk.cyan("DNA differences: ",countDifferences(refSeqModified2,seq2)));
    console.log(chalk.cyan("Protein differences: ", countDifferences(refSeqTranslation,seq2Translation)));
    console.log(chalk.green("seq 3: "));
    console.log("translation: ", seq3Translation)
    console.log(chalk.cyan("DNA differences: ",countDifferences(refSeq,seq3)));
    console.log(chalk.cyan("Protein differences: ", countDifferences(refSeqTranslation,seq3Translation)));
    console.log(chalk.green("seq 4: "));
    console.log("translation: ", seq4Translation)
    console.log(chalk.cyan("DNA differences: ",countDifferences(refSeq,seq4Modified)));
    console.log(chalk.cyan("Protein differences: ", countDifferences(refSeqTranslation,seq4Translation)));
    console.log(chalk.green("seq 5: "));
    console.log("translation: ", seq5Translation)
    console.log(chalk.cyan("DNA differences: ",countDifferences(refSeqModified5,seq5)));
    console.log(chalk.cyan("Protein differences: ", countDifferences(refSeqTranslation,seq5Translation)));
}

function translate(seq:string){
    let translation ="";
    const l = seq.length-2;
    for(let i=0; i<l; i=i+3){
        let aminoAcid = getAminoacid(seq.substring(i,i+3) as codon);
        translation=translation + AminoAcids[aminoAcid as AminoAcid];
    }
    return translation;
}

function getAminoacid(codon:codon){
    return DNACode[codon];
}

function countDifferences(refSeq:string, seq:string){
    let differences = [];
    for(let i=0; i<refSeq.length;i++){
        if(refSeq[i]!==seq[i]){
            differences.push(i);
        }
    }
    return differences;
    
}

export enum DNACode {
    AAA = "lys",
    AAC = "asn",
    AAG = "lys",
    AAT = "asn",
    ACA = "thr",
    ACC = "thr",
    ACG = "thr",
    ACT = "thr",
    AGA = "arg",    
    AGC = "ser",    
    AGG = "arg",    
    AGT = "ser",    
    ATA = "ile",    
    ATC = "ile",    
    ATG = "met",    
    ATT = "ile", 

    CAA = "gln",
    CAC = "his",
    CAG = "gln",
    CAT = "his",
    CCA = "pro",
    CCC = "pro",
    CCG = "pro",
    CCT = "pro",
    CGA = "arg",    
    CGC = "arg",    
    CGG = "arg",    
    CGT = "arg",    
    CTA = "leu",    
    CTC = "leu",    
    CTG = "leu",    
    CTT = "leu", 

    GAA = "glu",
    GAC = "asp",
    GAG = "glu",
    GAT = "asp",
    GCA = "ala",
    GCC = "ala",
    GCG = "ala",
    GCT = "ala",
    GGA = "gly",    
    GGC = "gly",    
    GGG = "gly",    
    GGT = "gly",    
    GTA = "val",    
    GTC = "val",    
    GTG = "val",    
    GTT = "val",    

    TAA = "stop",
    TAC = "tyr",
    TAG = "stop",
    TAT = "tyr",
    TCA = "ser",
    TCC = "ser",
    TCG = "ser",
    TCT = "ser",
    TGA = "stop",    
    TGC = "cys",    
    TGG = "trp",    
    TGT = "cys",    
    TTA = "leu",    
    TTC = "phe",    
    TTG = "leu",    
    TTT = "phe",   
}

type codon = "AAA"|"AAC"|"AAG"|"AAT"|"ACA"|"ACC"|"ACG"|"ACT"|"AGA"|"AGC"|"AGG"|"AGT"|"ATA"|"ATC"|"ATG"|"ATT"|
                    "CAA"|"CAC"|"CAG"|"CAT"|"CCA"|"CCC"|"CCG"|"CCT"|"CGA"|"CGC"|"CGG"|"CGT"|"CTA"|"CTC"|"CTG"|"CTT"|
                    "GAA"|"GAC"|"GAG"|"GAT"|"GCA"|"GCC"|"GCG"|"GCT"|"GGA"|"GGC"|"GGG"|"GGT"|"GTA"|"GTC"|"GTG"|"GTT"|
                    "TAA"|"TAC"|"TAG"|"TAT"|"TCA"|"TCC"|"TCG"|"TCT"|"TGA"|"TGC"|"TGG"|"TGT"|"TTA"|"TTC"|"TTG"|"TTT"


export enum AminoAcids {
    ala = "A",
    arg = "R",
    asn = "N",
    asp = "D",
    asx = "B",
    cys = "C",
    glu = "E",
    gln = "Q",
    glx = "Z",
    gly = "G",
    his = "H",
    ile = "I",
    leu = "L",
    lys = "K",
    met = "M",
    phe = "F",
    pro = "P",
    ser = "S",
    thr = "T",
    trp = "W",
    tyr = "Y",
    val = "V",
    stop = "-"
}

type AminoAcid = "ala"|"arg"|"asn"|"asp"|"asx"|"cys"|"glu"|"gln"|"glx"|"gly"|"his"|"ile"|"leu"|"lys"|"met"|"phe"|"pro"|"ser"|"thr"|"trp"|"tyr"|"val"|"stop"