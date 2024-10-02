function select(command) {
    return ArraySelectAll(tools.xquery(command));
}
function getManagersByType(bossTypeCode) {
    if (bossTypeCode === void 0) { bossTypeCode = "main"; }
    var sql = "sql:\n    SELECT\n      [t0].[person_id]\n    FROM [func_managers] AS [t0]\n      INNER JOIN [boss_types] AS [t1] ON [t1].[id] = [t0].[boss_type_id]\n    WHERE [t1].[code] = " + SqlLiteral(bossTypeCode) + "\n  ";
    var query = select(sql);
    var result = [];
    var collaboratorDocument;
    var personId;
    for (var i = 0; i < query.length; i++) {
        personId = query[i].person_id.Value;
        collaboratorDocument = tools.open_doc(personId);
        if (collaboratorDocument === undefined) {
            alert("\u041D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0430 \u043F\u043E id \"" + personId + "\"");
            continue;
        }
        result.push({
            personId: personId,
            fullname: collaboratorDocument.TopElem.fullname()
        });
    }
    return result;
}
var mainFuncManagers = getManagersByType();
var bpFuncManagers = getManagersByType("bp");
var unionManagers = ArrayUnion(mainFuncManagers, bpFuncManagers);
if (unionManagers.length === 0) {
    throw new Error("В системе должен быть хотя бы один руководитель");
}
alert("\u0424\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0440\u0443\u043A\u043E\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0438:\n" + ArrayExtract(unionManagers, "This.fullname").join(", "));
