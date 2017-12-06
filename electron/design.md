# Design Document

## Create or edit run config

Create document with list of splits.  

````json
{
  "name": "unique_name",
  "type": "nohit|deathless",
  "splits": [
    {"name":"any_name","hits":0},
    {"name":"any_name","hits":0}
  ]
}
```` 

- **name** -- this is the key of a run config.
- **type** -- either `nohit` or `deathless`
- **splits** -- list of splits to run. All you need is a name and hits.  
The order listed is the order they will be displayed in.

### Use case

- Click on config
- Click on add or edit run config
- Enter name & type
- Enter splis
- click save

This will save a new item in `db.run-config`;


## Start new run

Start a new run from a list of configs.

- View list of run configs.  
- Click on start
    - loads best splits for this config.
    - Creates new run document in db.runs
    
```json
  {
    "run-name": "name of run",
    "dateStarted": "date",
    "best-splits": [
      {"name":"split", "hits":0},
      {"name":"split", "hits":0}
    ],
    "splits": [
      {"name":"split", "hits":0},
      {"name":"split", "hits":0}
    ]
  }
```
- Goes to new page with run.
- play game
- finish
- save
- calculates best splits for this config.

```json
{
    "run-name":"name of run",
    "splits":[
      {"name":"somename", "hits":0}
    ]
}
```

-back to main screen


## db objects

- **runconfig**
- **bestruns**
- **currentrun**


