# OSRS Route Planner

This route planner is a powerfull website that will make much easier the process of creating an account route in Old School RuneScape. Every single detail of the adventure can be mapped out and a troubleshooting feature will allow to find issues within the route like missing levels to complete a diary step, an inventory containing too many items or an item missing to complete a quest.

## Planned features

### Route features

| Feature                          | Progress |
| -------------------------------- | -------- |
| Display steps panel              | _Done_   |
| List all steps in order          | _Done_   |
| Select a step                    | _Done_   |
| Mark a step as completed         | _Done_   |
| Show and hide sub-steps          | _Done_   |
| Serialize/Deserialize the route  | _Done_   |
| Edit a step's description        | _Done_   |
| Add a step                       | _Done_   |
| Add a sub-step                   | _Done_   |
| Move a step                      | _Done_   |
| Remove a step                    | _Done_   |
| Export/Import a route            | _Done_   |
| Navigate through steps with keys |          |

### Skill features

| Feature                                                  | Progress |
| -------------------------------------------------------- | -------- |
| Display skills panel                                     | _Done_   |
| Display total level                                      | _Done_   |
| Match skill levels to selected step                      | _Done_   |
| Highlight skills that gained experience on selected step | _Done_   |
| Add skill effect to selected step                        | _Done_   |
| Display experience required to reach the next level      | _Done_   |
| Merge similar skill effects together                     | _Done_   |
| Remove skill effect from selected step                   | _Done_   |

### Inventory features

| Feature                                                        | Progress      |
| -------------------------------------------------------------- | ------------- |
| Display inventory panel                                        | _Done_        |
| Match inventory items to selected step                         | _Done_        |
| Highlight items were added on the selected step                |               |
| Add inventory effect to selected step                          | _Implemented_ |
| Remove inventory effect from selected step                     | _Implemented_ |
| Merge similar item effects together                            | _Done_        |
| Add 'note' and 'unnote' inventory effects                      | _Implemented_ |
| Add 'drop all' inventory effect                                | _Implemented_ |
| Add 'bank all' inventory effect                                | _Implemented_ |
| Add issue when missing item from inventory to apply an effect  | _Implemented_ |
| Add issue when inventory is too full when appling an an effect | _Implemented_ |

### Equipment features

| Feature                                                       | Progress      |
| ------------------------------------------------------------- | ------------- |
| Display equipment panel                                       | _Done_        |
| Match equipped gear to selected step                          | _Done_        |
| Highlight gear that was added on the selected step            |               |
| Add equipment effect to selected step                         | _Implemented_ |
| Remove equipment effect from selected step                    | _Implemented_ |
| Merge similar equipment effects together                      |               |
| Add issue when missing gear from equipment to apply an effect |               |

### Bank features

| Feature                                                   | Progress      |
| --------------------------------------------------------- | ------------- |
| Display bank panel                                        |               |
| Match bank items to selected step                         |               |
| Highlight bank items that were added on the selected step |               |
| Add bank effect to selected step                          | _Implemented_ |
| Remove bank effect from selected step                     | _Implemented_ |
| Merge similar bank effects together                       |               |
| Add issue when missing item from bank to apply an effect  | _Implemented_ |

### Quest features

| Feature                                                    | Progress |
| ---------------------------------------------------------- | -------- |
| Display quests panel                                       |          |
| Match quests to selected step                              |          |
| Highlight quests that were progressed on the selected step |          |
| Search bar for quests                                      |          |
| Add quest effect to selected step                          |          |
| Remove quest effect from selected step                     |          |
| Add issue when missing quest requirement for quest         |          |
| Add issue when missing level requirement for quest         |          |
| Add issue when missing item requirement for quest          |          |

### Diary features

| Feature                                                        | Progress |
| -------------------------------------------------------------- | -------- |
| Display diary panel                                            |          |
| Match diaries to selected step                                 |          |
| Highlight diary tasks that were completed on the selected step |          |
| Search bar for diary tasks                                     |          |
| Add diary effect to selected step                              |          |
| Remove diary effect from selected step                         |          |
| Add issue when missing item requirement for diary task         |          |
| Add issue when missing quest requirement for diary task        |          |
| Add issue when missing level requirement for diary task        |          |
| Add issue when missing a diary task for diary completion       |          |

### Combat task features

| Feature                                                         | Progress |
| --------------------------------------------------------------- | -------- |
| Display combat task panel                                       |          |
| Match combat tasks to selected step                             |          |
| Highlight combat tasks that were completed on the selected step |          |
| Search bar for combat tasks                                     |          |
| Add combat task effect to selected step                         |          |
| Remove combat task effect from selected step                    |          |
| Add issue when missing item requirement for combat task         |          |
| Add issue when missing quest requirement for combat task        |          |
| Add issue when missing level requirement for combat task        |          |

### League features

| Feature                                                         | Progress |
| --------------------------------------------------------------- | -------- |
| Display league task panel                                       |          |
| Display league relics panel                                     |          |
| Match league tasks to selected step                             |          |
| Match league relics to selected step                            |          |
| Highlight league tasks that were completed on the selected step |          |
| Highlight league relics that were unlocked on the selected step |          |
| Search bar for league tasks                                     |          |
| Add league task effect to selected step                         |          |
| Add league relic/xp multiplier effect to selected step          |          |
| Remove league task effect from selected step                    |          |
| Remove league relic effect from selected step                   |          |
| Add issue when missing quest requirement for league task        |          |
| Add issue when missing level requirement for league task        |          |
| Add issue when missing item requirement for league task         |          |
| Add issue when missing point requirement for league relic       |          |

### Requirements features

| Feature                         | Progress |
| ------------------------------- | -------- |
| Display requirement graph       |          |
| Handle item requirements        |          |
| Handle item variations          |          |
| Handle skill requirements       |          |
| Handle quest requirements       |          |
| Handle diary requirements       |          |
| Handle combat task requirements |          |
| Handle alternative requirements |          |

### Recipe features

| Feature                                                 | Progress |
| ------------------------------------------------------- | -------- |
| Display recipe panel                                    |          |
| Display all recipe available the selected step          |          |
| Add recipe effect to directly handle the production     |          |
| Remove recipe effect from selected step                 |          |
| Add issue when missing quest requirement for recipe use |          |
| Add issue when missing item requirement for recipe use  |          |
| Add issue when missing skill requirement for recipe use |          |

### Shop features

| Feature                                                                    | Progress |
| -------------------------------------------------------------------------- | -------- |
| Display shop panel                                                         |          |
| Display all shop items available at the selected step                      |          |
| Add shop effect to directly handle the transaction                         |          |
| Remove shop effect from selected step                                      |          |
| Add issue when missing quest requirement for shop/item access              |          |
| Add issue when missing item requirement for shop/item access (ex: Zanaris) |          |
| Add issue when missing skill requirement for shop/item access (ex: LMS)    |          |

### Findable item features

| Feature                                                   | Progress |
| --------------------------------------------------------- | -------- |
| Display findable items panel                              |          |
| Display all findable items available at the selected step |          |
| Add item effect to directly handle the obtention          |          |
| Remove item effect from selected step                     |          |
| Add issue when missing quest requirement for item access  |          |
| Add issue when missing item requirement for item access   |          |
| Add issue when missing skill requirement for item access  |          |

### Route troubleshooting features

| Feature                                              | Progress |
| ---------------------------------------------------- | -------- |
| Display troubleshooting panel                        |          |
| Display issue for any step after every change        |          |
| Move to the problematic step when selecting an issue |          |
| Remove an issue from the panel when fixed            |          |

### Wiki crawler features

| Feature                         | Progress |
| ------------------------------- | -------- |
| Basic crawling capabilities     |          |
| Save crawled data into database |          |
| Fetch equipment data            |          |
| Fetch item data                 |          |
| Fetch diary data                |          |
| Fetch quest data                |          |
| Fetch combat task data          |          |
| Fetch league task data          |          |

### Account features

| Feature                                                 | Progress |
| ------------------------------------------------------- | -------- |
| Anonymous website usage with local storage route saving |          |
| User authentication with database route saving          |          |
| Share a route publicly for other users to follow        |          |

### Collaboration features

| Feature                                                      | Progress |
| ------------------------------------------------------------ | -------- |
| Collabore with another user on the same route simultaneously |          |

### Other features

| Feature                      |
| ---------------------------- |
| Death mechanics panel/effect |
| Alching effect               |
| F2P restrictions             |
