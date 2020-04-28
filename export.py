import os
import json
import argparse
import logging
import xml.etree.ElementTree as ET

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

log = logger.debug


def bootstrap():
    try:
        os.mkdir('dist')
    except FileExistsError as e:
        log("Directory 'dist' exists")


def export_projects(input_directory):
    all_projects = []
    for elem in os.listdir(input_directory):
        if elem.endswith('.aup'):
            log("Found audactity project '%s'" % elem)
            json_config = []
            
            tree = ET.parse('%s/%s' % (input_directory, elem))
            data_dir = elem.replace('.aup', '_data')
            all_projects.append({
                "name": elem.replace('.aup', ''),
                "link": "#"+elem.replace('.aup', '')
            })
            root = tree.getroot()
            for node in root.findall('xmlns:import', namespaces={'xmlns': 'http://audacity.sourceforge.net/xml/'}):
                filename = node.attrib.get('filename')
                mute = node.attrib.get('mute')
                gain = node.attrib.get('gain')
                offset = node.attrib.get('offset')
                log("   %s %s %s %s" % (filename, mute, gain, offset))
                json_config.append({
                    "src": "audacity_projects/%s/%s" % (data_dir, filename),
                    "name": filename,
                    "gain": float(gain),
                    "muted": mute == "1",
                    "start": float(offset)
                })
            ouput_file = "src/audacity_projects/%s" % elem.replace('.aup', '.json')
            with open(ouput_file, 'w') as f:
                json.dump(json_config, f, indent=True)
    with open("src/all_projects.json", 'w') as f:
        json.dump(all_projects, f, indent=True)                
    
if __name__ == "__main__":

    parser = argparse.ArgumentParser(
        formatter_class=argparse.RawTextHelpFormatter,
        description="""
This tool allow you to publish your audactity project as html+js+css+ogg static files.
Save your projects as a compressed projects.
And then run this tool.

Source directory example:

src/audacity_projects
├── drum_4_5.aup
├── drum_4_5_data
│   ├── drum_4_5.ogg
│   ├── Piste audio.ogg
│   └── Piste audio-2.ogg
├── essai_base_roms.aup
├── essai_base_roms_data
│   ├── Piste audio.ogg
│   ├── Piste audio-10.ogg
│   ├── Piste audio-11.ogg
│   ├── Piste audio-12.ogg
│   ├── Piste audio-13.ogg
│   ├── Piste audio-2.ogg
│   ├── Piste audio-3.ogg
│   ├── Piste audio-4.ogg
│   ├── Piste audio-5.ogg
│   ├── Piste audio-6.ogg
│   ├── Piste audio-7.ogg
│   ├── Piste audio-8.ogg
│   ├── Piste audio-9.ogg


Put all the src directory content to a static web server and your projects are online.
                    """)
    parser.add_argument(
        '-s', "--projects-source-directory", type=str,
        default="src/audacity_projects",
        help="the directory where your audacity light project are stored")
    args = parser.parse_args()
    log(args)
    bootstrap()
    export_projects(input_directory=args.projects_source_directory)
    
