<img
src="https://i.imgur.com/kteCTlm.jpeg" alt="banner">

<h1 align="center">
  <img src="https://i.imgur.com/kFhbHuc.jpeg" width="22px" alt="icon">
  Arafat's GoatBot Commands Store
</h1>

<p align="center">
If you find any issues, feel free to report them!
</p>

<p align="center">
  Facebook: <a href="https://www.facebook.com/arafatas602" style="color: black;">Arafat Sarder</a>
</p>

<p align="center">
  <a href="https://www.facebook.com/arafatas602" target="_blank" rel="noopener noreferrer">
    <img src="https://i.imgur.com/kFhbHuc.jpeg" width="300">
  </a>
</p>

<h5 align="center">𝐀𝐫𝐚𝐟𝐚𝐭 𝐒𝐚𝐫𝐝𝐞𝐫 🗿</h5>

---

## Description
**Arafat Command Store** is a GoatBot v2 command that provides a fully paginated and searchable list of all available commands stored in a remote JSON database.  
It allows users to browse commands, view details, search by name or first letter, and retrieve a command's URL by replying with its number.

---

## Command Information
- **Name:** cmds  
- **Author:** Arafat  
- **Version:** 1.0  
- **Category:** General  
- **Role Required:** 0 (Everyone)  
- **Cooldown:** 3 seconds  

---

## Features
✅ Paginated list of all available commands  
✅ Search by full command name  
✅ Search by starting letter  
✅ View command details (author, last update)  
✅ Retrieve command download URL by replying with its number  
✅ Remote database for fast dynamic updates  


## Usage

### Detailed Usage Instructions:
#### 1. **View the first page of commands**


- Displays the first 10 commands along with their author and last update.  
- Includes pagination details and a tip to see the next page.

#### 2. **View a specific page (e.g., page 2)**


- Shows the next set of 10 commands.  
- If the page number is invalid, an error message is displayed.

#### 3. **Search for a command by its full name**


- Returns details of the command if found.  
- If no matching command exists, it returns an error message.

#### 4. **Search commands starting with a specific letter**




- Displays all commands that start with "a".  
- If no commands match, it returns an error.

#### 5. **Retrieve a command’s URL**  
- After running `#cmds`, reply with the command number to get its URL.
- Example:
  ```
  #cmds
  ```
  *Bot response:*  
  ```
  ╭─‣ 1: imgur
  ├‣ Author: Arafat
  ├‣ Update: 23-11-2025
  ╰────────────◊
  ```
  - Reply with 1 to get the URL for "jan".

## Example OutputOutput


## Dependencies
- [`axios`](https://www.npmjs.com/package/axios) - Used to fetch the command list and URLs from GitHub.

## Installation
1. Make sure `axios` is installed in your project:


2. Add the `cmds` command file to your GoatBot `commands` directory.

## Notes
- The command fetches data from:  
- Commands List: [`CMDSRUL.json`](https://raw.githubusercontent.com/Arafat-Core/cmds/refs/heads/main/CMDSRUL.json)  
- Command URLs: [`CMDS.json`](https://raw.githubusercontent.com/Arafat-Core/cmds/refs/heads/main/CMDS.json)  
- If a command is not found, an error message is shown.
- Pagination ensures that only 10 commands are displayed per page.

---

**Maintained by:** Arafat  
If you find any issues, please report them!

𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤: <a href="https://www.facebook.com/Arafatas602" style="color: black;">Arafat</a></h3></div>

## Cradit

First of all, I am making this inspired by MahMUD Bhai's Command Store Hinata Store. Here, 90% credit goes to MahMUD Bhai.

