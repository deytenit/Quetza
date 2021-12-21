import fetch from "node-fetch";

export function getDrivers(year = "current", callback: (data: any) => void): void  {
    fetch(`http://ergast.com/api/f1/${year}/driverStandings.json`)
    .then(res => res.json())
    .then(json => callback(json.MRData.StandingsTable.StandingsLists[0]));
}

export function getConstructors(year = "current", callback: (data: any) => void): void  {
    fetch(`http://ergast.com/api/f1/${year}/constructorStandings.json`)
    .then(res => res.json())
    .then(json => callback(json.MRData.StandingsTable.StandingsLists[0]));
}

export function getSchedule(year = "current", callback: (data: any) => void): void  {
    fetch(`http://ergast.com/api/f1/${year}.json`)
    .then(res => res.json())
    .then(json => callback(json.MRData.RaceTable));
}

export function choicesGenerator(): object[] {
    let response = []
    for (let year = new Date().getFullYear(); year >= 1950; year--) {
        response.push({
            "name": `{year}`,
            "value": `{year}`
        });
    }
    return response;
}