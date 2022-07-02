export const Ruleset = {
    Whitelist: "Whitelist (keep)",
    Graylist: "Graylist (jar)",
    Blacklist: "Blacklist (delete)",
};

export class Rule {
    /**
     *
     * @param {string} name User-friendly name for this rule
     * @param {string} filterExpression The filter expression used to find cookies this rule applies to
     * @param {Ruleset} ruleset The ruleset to apply to cookies matching this rule.
     */
    constructor(name, filterExpression, ruleset, date) {
        this.name = name ?? "";
        this.filterExpression = filterExpression ?? "";
        this.ruleset = ruleset ?? Ruleset.Blacklist;
        this.date = date;
    }
}
