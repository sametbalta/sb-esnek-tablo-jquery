/**
 * Created by sBalta on 22.03.2014.
 */

(function ($) {

    $.fn.esnekTablo = function (settings, userData) {

        settings = $.extend({ //defaults
            title: 0,
            headerTextAlign: "left",
            dataModel: {
                "dataType": "array",
                "dataRoot": ""
            }
        }, settings);

        var tableId = this.attr('id') + '-sb-table';

        this.addClass("sb-esnek-tablo");

        // var tableWidth = this.width(); // tablonun genişliği

        this.append('<table width=100% cellspacing="0" cellpadding="0" id="' + tableId + '" class="sb-table"><caption>' + settings.title + '</caption></table>'); // tabloyu oluştur

        /**
         * BAŞLIK HAZIRLA
         * İstenen kolonlara göre tablonun başlıkları oluşutulur.
         * Eğer kolonlarda width belirtilmişse kolon genişliği için bu değer geçerlidir.
         * Kalan genişlik flex'ler ile doğru orantılı olarak bölüştürülür.
         */

        var totalFlex = 0;
        var totalWidth = 0;

        $.each(settings.columns, function (key, val) {
            if (isNaN(val.width)) {
                if (isNaN(val.flex)) {
                    val.flex = 1; // default flex
                }
                else {
                    val.flex = parseInt(val.flex);
                }
                totalFlex += val.flex;
            }
            else {
                val.width = parseInt(val.width);
                totalWidth += val.width;
            }
        });

        var separators = '', i = 0;

        $.each(settings.columns, function (key, val) {

            // sabit genişlik istenenler sabit verilir. diğerleri flex ile doğru orantılı paylaştırılır
            var cellWidth = isNaN(val.width) ? 100 * val.flex / totalFlex + '%' : val.width + 'px';
            //var w = isNaN(val.width) ? (tableWidth - totalWidth) * val.flex / totalFlex : val.width; // ayıcının pozis
            var text = val.header == undefined ? "" : val.header;
            var s = 'text-align:' + settings.headerTextAlign + ';';
            var header = $('#' + tableId + '').append('<td id="sb-header-' + i + '" width=' + cellWidth + ' class="header"><div class="cell" style =" ' + s + '">' + text + '</div></td>');
            var l = $('#sb-header-' + (i++)).offset(); // last insert
            //separators += '<div style="background-color:#666; float: left; height: 150px; width:2px; left: ' + (l.left + w) + 'px;"></div>';
        });
        //this.append('<div class="separator">' + separators + '</div>');

        /**
         * DATA İŞLEMLERİ
         */

        var d = function (data) {
            var i = 0;
            $.each(data, function (key, obj) {
                var row = '<tr>';
                $.each(settings.columns, function (key, val) {

                    var value = obj;
                    $.each(val.dataIndex.split("."), function (k, v) {
                        value = value[v];
                    });

                    var text = value == undefined ? "" : value;

                    var s = 'background-color:' + (i % 2 ? '#fafafa' : '#fff') + ';'; // ardaşık satırların okunaklılığı için ton farkı gerekli.
                    if (obj.textAlign != undefined) // default left
                        s += 'text-align:' + obj.textAlign + ';';

                    s += 'paddind:5px;';

                    row += '<td><div class="cell" style=' + s + '>' + text + '</div></td>';

                });
                i++;
                $('#' + tableId + '').append(row + '</tr>');
            });
        };

        if (settings.dataModel.dataType == 'json') {
            $.ajax({
                type: 'GET',
                url: settings.dataModel.url,
                jsonpCallback: 'jsonCallback',
                contentType: "application/json",
                dataType: 'json',
                success: function (json) {
                    var data = json;
                    if (settings.dataModel.dataRoot != undefined)
                        $.each(settings.dataModel.dataRoot.split("."), function (k, v) {
                            data = data[v];
                        });
                    d(data);
                },
                error: function (e) {
                    console.log(e.message);
                }
            });
        }
        else if (settings.dataModel.dataType == 'jsonp') {
            $.ajax({
                type: 'GET',
                url: settings.dataModel.url,
                jsonpCallback: 'jsonCallback',
                contentType: "application/json",
                dataType: 'jsonp',
                success: function (json) {
                    var data = json;
                    $.each(settings.dataModel.dataRoot.split("."), function (k, v) {
                        data = data[v];
                    });
                    d(data);
                },
                error: function (e) {
                    console.log(e.message);
                }
            });
        }

        else { //Array
            d(userData);
        }

    }

})(jQuery);

