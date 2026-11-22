# IRLISE RISTORANTE 2.2

**3D Restaurant Simulation Game**

Play the production release: [IRLISE RISTORANTE](https://irlise-ristorante.pages.dev)

Version: `2.2.0`

## Update 2.2 — Build From Zero

- New players begin with an empty dining area: no pre-placed tables or chairs.
- New-game starting funds are 2,000 coins, enough to purchase the first table (800 coins).
- Each purchased dining table automatically includes four chairs; chairs are not sold separately in the shop.
- Level 1 offers only Ayam Geprek and Es Teh. Their complete ingredient packs cost 1,100 coins in total, so a new player can buy the 800-coin table and all Level 1 ingredients for 1,900 coins, leaving 100 coins.
- Level 1 ingredient packs: rice 150, chicken 250, flour 100, cooking oil 150, spices 150, vegetables 150, tea 100, and ice 50 coins.
- The beginner tutorial guides the player to move to the cashier, open the business menu, buy the first table, wait for the first customer, and follow the existing order/cooking/serving workflow.
- Existing saves retain the three starter tables from earlier versions, plus any tables and chairs they purchased. Existing coins, staff, levels, inventory, and unlocks are preserved.

## Previous systems retained

Daily Missions and rewards, 3D restaurant simulation, customers, kitchen workflow, staff and shifts, levels and XP, market and inventory, settings, language selection, save import/export, and Owner's Office unlock progression.

## Kitchen workflow and customer service

- Up to two orders can cook at the same time, using separate cooking timers.
- Level 1 Es Teh takes 2 seconds; Ayam Geprek takes 5 seconds.
- Each customer orders a maximum of 2 menu items (1–2 items per visit).
- The player can carry up to 2 ready dishes at once and deliver them one by one.
- Every completed dish enters its own ready-to-serve queue, so players can carry and deliver dishes one at a time without waiting for the other dish.
- A ready dish can be delivered to any seated customer who ordered that menu, including a different customer in the queue.
- Customers become visibly angry after 20 seconds of waiting and leave after 30 seconds; leaving customers reduce restaurant reputation.
- Completed orders adjust reputation according to total waiting time: faster service earns a better customer rating.


### Restaurant progression updates
- Customer order size scales with restaurant level: Level 1 = up to 2 menu items; Levels 2–3 = up to 3; Levels 4–5 = up to 4; Levels 6–7 = up to 5; Levels 8–10 = up to 6.
- Level 2 recruitment unlocks: Morning Shift Chef, Evening Shift Waiter, Morning Shift Cashier, and Evening Shift Cashier. The player serves dishes during the morning while the hired chef cooks; during the evening, the player cooks while the hired waiter delivers dishes. Both cashiers automatically receive and confirm customer orders.
- The Morning Shift Waiter becomes available at Level 4, and the Evening Shift Chef becomes available at Level 6, gradually completing both teams.


## Workday, shifts, and payroll

- One in-game workday runs from 08:00 to 22:00 and lasts approximately 5 minutes in real time.
- Morning shift: 08:00–15:00. Evening shift: 15:00–22:00.
- Use the in-game **BUKA RESTORAN / TUTUP RESTORAN** control to stop new customer arrivals or reopen the restaurant during the workday.
- Staff wages are monthly and are charged at the end of every 30 in-game days, not every day.
- Monthly wages: Chef 2,000 coins; Waiter 1,500 coins; Cashier 1,200 coins. The Level 2 team of one chef, one waiter, and two cashiers costs 5,900 coins per in-game month.


## Major Update 2.2 — Employee Management & Engineering

### New employee departments
- Operations: chefs, waiters, and cashiers continue to support the morning and evening shifts.
- Administration: Admin Keuangan supports monthly payroll and financial summaries; Admin HRD provides an employee performance overview.
- Engineering: Teknisi Maintenance and Engineering Supervisor maintain restaurant facility condition.
- New roles unlock progressively: Admin Keuangan at Level 4, Technician at Level 5, Admin HRD at Level 6, and Engineering Supervisor at Level 8.

### Salary and employee development
- Every employee has an individual monthly salary saved with the game.
- The owner can raise or lower each employee's salary in 10% steps, within 50%–200% of the role's base salary.
- Salary raises require a performance indicator of at least 70%; salary reductions remain available within the same salary limits.
- Skill upgrades increase the employee's monthly salary; existing skill levels and staff saves are preserved.
- Employee performance is shown as a management indicator based on the restaurant's reputation. Salary decisions remain under the player's control.
- Monthly payroll uses each employee's current salary and is charged every 30 in-game days.

### Engineering and maintenance
- Restaurant equipment has a saved condition percentage.
- Without engineering staff, facility condition gradually decreases at each daily closing.
- A Maintenance Technician and Engineering Supervisor improve facility condition automatically at daily closing.
- The owner can perform manual maintenance for 350 coins to restore condition to 100%.
- Poor facility condition slows cooking: 20% slower below 60%, and 50% slower below 30%.

### Preview / release gate
- These new management and maintenance systems are committed to the 2.2 development branch only.
- They have not yet been verified in Cloudflare Preview gameplay. Test hiring/unlocking each department, salary adjustments and payroll, save/load compatibility, equipment condition changes, technician effects, and cooking-time penalties before release.
- Keep this PR unmerged and production 2.1 unchanged until the owner approves release.
