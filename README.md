## TalkingData Cli

### Install

```bash
# npm
npm i -g tkd
# yarn
yarn global add tkd
```

## Login

```bash
tkd login <cookie>
```

### Abandon custom event

```bash
tkd abd like <likeId1> [likeId2 [likeId3] ...]
tkd abd id <projectId1> [projectId2 [projectId3] ...]
```

#### Use Execl abandon custom event

```bash
tkd abd file <filePath>
```

##### Example

**Execl**

| Delete id    | Not delete | Most contain |
|--------------|------------|--------------|
| 01ClickTable | 02         | Click        |
| 02ClickDiv   |            |              |
| 03ClickSpan  |            |              |
| 04TapA       |            |              |

**Before**

| CustomName   |
|--------------|
| 01ClickTable |
| 02ClickDiv   |
| 03ClickSpan  |
| 04TapA       |

**After**

| CustomName |
|------------|
| 02ClickDiv |
| 04TapA     |
