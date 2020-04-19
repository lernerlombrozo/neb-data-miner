import fs from 'fs';
import path from 'path';
import config from 'config';
import axios from 'axios';
import chalk from 'chalk';
import { setFlagsFromString } from 'v8';

let BaseUrl:string = config.get('originURL');
let TableUrl:string = config.get('tableURL');

export let ENZYMES :Enzyme [] = [];
export async function getEnzymesHTML(){
    if(!config.get("getEnzymes")){
        console.log(chalk.yellow("you selected not to load the enzymes"));
        fetchFromFile();
        return
    };
    try {
        console.log(chalk.cyan("Getting enzyme list"));
        const { data } = await axios.get(BaseUrl + TableUrl)
        const table = extractOne('<blockquote>','</blockquote>',data).occurrence;
        const urls = extractAll('href="', '" style="text-decoration:none;',table);
        const recognitionSequences = extractAll('</a> ','\n',table);
        let enzymes: Enzyme[] = [];
        let enzymeAmount = urls.length;
        for (let i = 0; i<enzymeAmount; i++) {
            console.log(chalk.cyan("got enzyme "+ (i+1) + " of " + enzymeAmount + " ("+ ((i+1)/enzymeAmount*100).toFixed(2)+"%)"))
            const { data } = await axios.get(BaseUrl + urls[i]);
            let enzyme = extractAllData(data,recognitionSequences[i]);
            enzymes.push(enzyme)
        }
        ENZYMES = enzymes;
        saveFile();
    } catch (error) {
        console.error(error);
    }
}

function extractAll(start:string, end:string, html:string) : string[]{
    let occurrences: string[]= [];

    getExtracted(html);
    function getExtracted(html:string): void{
        let result = extractOne(start,end,html,true);
        if(result.occurrence){
            occurrences.push(result.occurrence);
            getExtracted(result.html);
        } else{
            return;
        }
    }

    return occurrences;
}

// start: must be the first occurence in html
// end: must be the first occurence after start
// getRemain is useful to remove ocurrence from html so a function can get the next ocurrence
function extractOne(start:string, end:string, html:string, getRemain = false):{occurrence: string, html:string}{
    let firstCharIndex = html.indexOf(start);
    html = html.substring(firstCharIndex);
    firstCharIndex = firstCharIndex < 0 ? firstCharIndex: 0;
    const lastCharIndex = html.indexOf(end);
    if(firstCharIndex>=0 && lastCharIndex>=0){
        let occurrence = html.substring(
            firstCharIndex + start.length, 
            lastCharIndex
        ).trim();
        if(getRemain){
            html = html.substring(lastCharIndex+end.length)
            return {occurrence,html}
        }
        return {occurrence,html:""}
    } else{
        return {occurrence:"",html};
    }
}

function extractAllData(html:string, sequence:string): Enzyme {
    html = extractOne('<body', '</body>',html).occurrence;
    let name = extractOne('<font size="+2"><b>','</b></font>',html,true);
    html = name.html;
    let temperature = extractOne('temperature: </b>','\n', html,true);
    html = temperature.html;
    let neoschizomersTable = extractOne('<b>Neoschizomers:</b><br>','<td valign=top>',html);
    let neoschizomers = extractAll('<font color="#8B008B">','</font>',neoschizomersTable.occurrence)
    let isoschizomersTable = extractOne('<b>Isoschizomers:</b><br>','</tr>\n\n', html);
    let isoschizomers = extractAll('<font color="#8B008B">','</font>',isoschizomersTable.occurrence)
    let ends = extractOne('</b><br><br>','</td>\n<td valign=top>', html, true);
    html =ends.html   

    return new Enzyme(name.occurrence, ends.occurrence, sequence, temperature.occurrence, neoschizomers, isoschizomers);

}

export class Enzyme{
    constructor(
        public name:string,
        public ends:string,
        public sequence:string,
        public temperature:string,
        public neoschizomers:string | string[],
        public isoschizomers:string | string[]
        ){}
}

function saveFile():void{
    if(process.mainModule && process.mainModule.filename){
        const enzymesFile = path.join(/* path.dirname(process.mainModule.filename), */'data','enzymes.json');   
        fs.writeFile(enzymesFile, JSON.stringify(ENZYMES),(err)=>{
            console.error(chalk.red(err));
        });
    }
}

function fetchFromFile():void{
    if(process.mainModule && process.mainModule.filename){
        const enzymesFile = path.join(/* path.dirname(process.mainModule.filename), */'data','enzymes.json');   
        fs.readFile(enzymesFile,(err,fileContent)=>{
            if(err){
                console.log(chalk.red("You haven't loaded the enzymes, please change getEnzymes to true in config file."));
                return
            } 
            ENZYMES = JSON.parse(fileContent.toString());   
            console.log(chalk.cyan(ENZYMES))
        })
    }
}