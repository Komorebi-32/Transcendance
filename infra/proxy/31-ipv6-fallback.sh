#!/bin/sh
# Our config listens on IPv4 and IPv6. On a kernel without IPv6, nginx would
# refuse to start on the [::] lines, so remove them there.
set -eu

if [ ! -f /proc/net/if_inet6 ]; then
    echo "$0: IPv6 not available, listening on IPv4 only"
    sed -i '/listen \[::\]/d' /etc/nginx/conf.d/default.conf
fi