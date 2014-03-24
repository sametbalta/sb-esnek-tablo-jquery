# Esnek Tablo jQuery (Taslakj)
================================

## 1. How To Use

```js
$('#my-div').esnekTablo(settings, data);
```

Note : When setting.dataModel is specified , "data" is not required. 

## 2. Setting

Sample :

```js
{
    "title": "Baslik",
    "columns": [
        {
            "header": "Name",
            "width": 200,
            "dataIndex": "name"
        },
        {
            "header": "Adres",
            "flex": 2,
            "dataIndex": "location.address"
        }
    ],
    "dataModel": {
        "dataType": "jsonp",
        "dataRoot": "response.root",
        "url": "https://remoteurl.com"
    }
}
```





