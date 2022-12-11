export default {
    datatable(tableid) {
        $(function() {
            $(tableid).DataTable({
                "bDestroy": true,
                pageLength: 10,
                lengthMenu: [
                    [5, 10, 20],
                    [5, 10, 20]
                ],
            });
        });
    },
}
