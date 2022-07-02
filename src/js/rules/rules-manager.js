import { Rule, Ruleset } from "./rule.js";

export class RulesManager {
    /**
     *
     * @returns {Promise<Rule[]>}
     */
    async getAll() {
        // TODO: return.. not.. dummy data
        return new Promise((resolve, reject) => {
            resolve([
                new Rule(
                    "Default",
                    "*",
                    Ruleset.Blacklist,
                    new Date(2022, 4, 3)
                ),
                new Rule(
                    "Google",
                    "domain:google.com",
                    Ruleset.Graylist,
                    new Date(2022, 5, 2)
                ),
                new Rule(
                    "zucc",
                    "domain:facebook.com",
                    Ruleset.Blacklist,
                    new Date(2022, 5, 3)
                ),
                new Rule('"the hub"', "domain:*.github.com", Ruleset.Whitelist),
                new Rule(
                    "hackerman 🕶️",
                    "domain:*hackernews.com",
                    Ruleset.Whitelist,
                    new Date(2022, 6, 15)
                ),
            ]);
        });
    }
}
