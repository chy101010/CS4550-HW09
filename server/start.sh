# From Nat Tuck's CS4550 Lecture Note
#!/bin/bash

export MIX_ENV=prod
export PORT=4804

CFGD=$(readlink -f ~/.config/events)

if [ ! -e "$CFGD/base" ]; then
	echo "Deploy First"
	exit 1
fi

DB_PASS=$(cat "$CFGD/db_pass")
export DATABASE_URL=ecto://hw09:$DB_PASS@localhost/hw09_prod
echo $DATABASE_URL

SECRET_KEY_BASE=$(cat "$CFGD/base")
export SECRET_KEY_BASE

_build/prod/rel/hw09/bin/hw09 start