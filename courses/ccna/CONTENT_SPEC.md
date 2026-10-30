# CCNA 200-301 v2.0 — course-specific content rules

Read the hub-wide format first: `../../CONTENT_SPEC.md` (file layout, lesson,
question and flashcard schemas, validation). This file adds the Cisco rules.

All study content targets the **official Cisco 200-301 CCNA v2.0 blueprint** in
`content/blueprint.js`.

## Cisco specifics

1. **Never use dump content.** Cisco exam content is under NDA; leaked
   questions violate the Cisco certification agreement.
2. **IOS syntax must be valid IOS/IOS-XE.** Show-command output in exhibits
   must be self-consistent (interface names, IPs, masks, states, timers all
   agree with each other and with the question).
3. **Defaults to remember:** IOS-XE on Catalyst 9k / ISR 1k/4k style interface
   names (`GigabitEthernet0/0/0` on routers, `GigabitEthernet1/0/1` on
   switches), unless the question needs classic names. Keep naming consistent
   within one question.
4. IOS config and show output in lessons go in ` ```ios ` fences so prompts and
   up/down states are highlighted:
   ```ios
   R1(config)# router ospf 1
   R1(config-router)# router-id 1.1.1.1
   ```

## Question mix per bank

~60% single, ~15% multi, ~10% order/match, ~10% fill, plus at least 25% of all
questions with an `exhibit` (show output, config, routing tables, syslog lines,
JSON, packet captures, etc.). v2.0 leans hard into **troubleshoot / diagnose /
interpret**, so reflect that.

## CLI labs

Labs live in `plugins/sim/labs/*.js` and are listed in `plugins/sim/labs/index.js`;
`tests/sim-labs.test.js` replays every lab's solution. Labs with
`examEligible: true` can appear inside the exam simulator.

## Validate

```
node scripts/validate-content.mjs ccna 3      # your domain number
```
