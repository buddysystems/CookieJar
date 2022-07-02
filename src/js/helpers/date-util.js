function join(t, a, s) {
    function format(m) {
        let f = new Intl.DateTimeFormat("en", m);
        return f.format(t);
    }
    return a.map(format).join(s);
}

export function formatDateShort(date) {
    const a = [{ month: "short" }, { year: "numeric" }];
    console.dir(a);
    return join(date, a, " ");
}
