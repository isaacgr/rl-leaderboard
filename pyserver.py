import subprocess
import asyncio
import aiohttp
import argparse
import logging
import signal
import sys
from aiohttp import web
import aiohttp_cors
import subprocess
import json
from typing import Dict, Optional


FORMAT = "%(asctime)s:%(levelname)s:%(name)s:%(message)s"
datefmt = "%Y-%m-%dT%H:%M:%S"
log = logging.getLogger(__name__)


class RLHandler(object):

    def handle_get_player(self, request):
        id = request.rel_url.query.get('id')
        cmd = "curl -k -s https://api.tracker.gg/api/v2/rocket-league/standard/profile/steam/%s" % id
        process = subprocess.Popen(
            cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        if stderr:
            print(stderr)
            raise stderr
        return web.json_response(json.loads(stdout), status=200)

    def handle_get_playlist(self, request):
        id = request.rel_url.query.get('id')
        season = request.rel_url.query.get('season')
        cmd = "curl -k -s https://api.tracker.gg/api/v2/rocket-league/standard/profile/steam/%s/segments/playlist?season=%s" % (
            id, season)
        process = subprocess.Popen(
            cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        if stderr:
            print(stderr)
            raise stderr
        return web.json_response(json.loads(stdout), status=200)

    def handle_get_sessions(self, request):
        id = request.rel_url.query.get('id')
        cmd = "curl -k -s https://api.tracker.gg/api/v2/rocket-league/standard/profile/steam/%s/sessions" % id
        process = subprocess.Popen(
            cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        if stderr:
            print(stderr)
            raise stderr
        return web.json_response(json.loads(stdout), status=200)


app = web.Application()

handler = RLHandler()

cors = aiohttp_cors.setup(app, defaults={
    "*": aiohttp_cors.ResourceOptions(
        allow_credentials=True,
        expose_headers="*",
        allow_headers="*"
    )}
)

cors.add(
    app.router.add_route(
        'GET',
        '/player',
        handler.handle_get_player
    )
)

cors.add(
    app.router.add_route(
        'GET',
        '/playlist',
        handler.handle_get_playlist
    )
)

cors.add(
    app.router.add_route(
        'GET',
        '/sessions',
        handler.handle_get_sessions
    )
)


async def start_server(app: web.Application, host: str = '127.0.0.1', port: int = 8080):
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, host, port)
    await site.start()

    log.info("======= Serving on %s:%s ======" % (host, port))

    while True:
        await asyncio.sleep(3600)  # sleep forever


def parse_commandline():
    parser = argparse.ArgumentParser(
        description='Make queries to jira/stash graphql connector',
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    serverGroup = parser.add_argument_group('HTTP Server')
    serverGroup.add_argument(
        '--http-server', action='store_true', help='Start the http server, otherwise will just fetch repos')
    serverGroup.add_argument('--host', default='127.0.0.1',
                             help='IP address to host http server')
    serverGroup.add_argument('--port', type=int, default=8080,
                             help='Port to host http server')
    parser.add_argument('--log-file', help='File for logging')
    return parser.parse_args()


def main():
    options = parse_commandline()
    if options.log_file:
        logfile = options.log_file
        logging.basicConfig(filename=logfile,
                            level=logging.INFO, format=FORMAT, datefmt=datefmt)
    else:
        logging.basicConfig(stream=sys.stdout,
                            level=logging.INFO, format=FORMAT, datefmt=datefmt)

    loop = asyncio.get_event_loop()
    signals = (signal.SIGHUP, signal.SIGTERM, signal.SIGINT)
    for sig in signals:
        loop.add_signal_handler(
            sig,
            lambda s=sig: asyncio.create_task(shutdown(loop, s))
        )
    loop.set_exception_handler(handle_exception)

    # TODO: add retries etc.
    # should probably handle each of these seperately beyond logging
    try:
        loop.run_until_complete(start_server(app))
    except (aiohttp.client_exceptions.ClientConnectorError, ConnectionResetError) as e:
        log.error(e)
    except aiohttp.client_exceptions.ServerDisconnectedError as e:
        log.error(e)
    except aiohttp.client_exceptions.ContentTypeError as e:
        log.error('Invalid response type [%s]' % e)
    except asyncio.CancelledError:
        pass


def handle_exception(loop: asyncio.AbstractEventLoop, context: Dict[str, str]):
    log.error(
        'Exception caught. Shutting down. Message [%s]' % context.get('message'))
    asyncio.create_task(shutdown(loop))


async def shutdown(loop: asyncio.AbstractEventLoop, signal: Optional[bool] = None) -> None:
    """Cleanup tasks tied to the service's shutdown."""
    if signal:
        logging.info(f"Received exit signal {signal.name}")
    tasks = [t for t in asyncio.all_tasks() if t is not
             asyncio.current_task()]

    [task.cancel() for task in tasks]

    logging.info(f"Cancelling {len(tasks)} outstanding tasks")
    await asyncio.gather(*tasks, return_exceptions=True)
    logging.info(f"Flushing metrics")
    loop.stop()

if __name__ == '__main__':
    main()
