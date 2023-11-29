let array = [
  [
    {
      revisionId: '992d8d9c-6866-4332-896d-b821885974cf',
      parentRevisionId: '5721e2ea-680a-427f-a577-45ac4684e528',
      notes: '',
      createdAt: '2023-10-11T11:38:43.041Z',
      updatedAt: '2023-10-11T12:00:37.136Z',
      status: 'DRAFT',
      errors: [],
      properties: [Array],
      equipments: [Array],
      networks: [Array],
      gatewayInterfaces: [],
      connectors: [Object],
      pinnedResources: {},
      tags: {},
    },
    {
      revisionId: '0b29c19a-2da4-45f8-a8d5-e683d4a40f76',
      parentRevisionId: '5721e2ea-680a-427f-a577-45ac4684e528',
      notes: '',
      createdAt: '2023-10-06T20:27:42.849Z',
      updatedAt: '2023-10-11T11:38:42.896Z',
      status: 'DISCARDED',
      errors: [],
      properties: [],
      equipments: [],
      networks: [],
      gatewayInterfaces: [],
      connectors: [Object],
      pinnedResources: {},
      tags: {},
    },
  ],
  [
    {
      revisionId: '332d78c6-acf7-42b7-8a63-c489ceaa4d89',
      parentRevisionId: 'a157274a-0925-4ebb-9bbe-f5cb361666f0',
      notes: '',
      createdAt: '2023-11-16T14:47:09.130Z',
      updatedAt: '2023-11-16T14:47:09.130Z',
      status: 'DRAFT',
      errors: [],
      properties: [Array],
      equipments: [Array],
      networks: [Array],
      gatewayInterfaces: [Array],
      connectors: [Object],
      pinnedResources: {},
      tags: {},
    },
    {
      revisionId: 'a157274a-0925-4ebb-9bbe-f5cb361666f0',
      parentRevisionId: '9a376da8-d84d-4109-8edc-e1fe39759a5f',
      notes: '',
      createdAt: '2023-11-16T13:28:46.797Z',
      updatedAt: '2023-11-16T14:47:02.821Z',
      status: 'CURRENT',
      errors: [],
      properties: [Array],
      equipments: [Array],
      networks: [Array],
      gatewayInterfaces: [Array],
      connectors: [Object],
      pinnedResources: {},
      commandId: '65562b6624f53b2b09df0bef',
      tags: {},
    },
  ],
];
let ids = ['a', 'b'];
/* for (let device in array) {
} */
let globalConfig = {};
for (let i in ids) {
  globalConfig[ids[i]] = { config : array[i].find(config=>config.status="CURRENT") };
}
let config = globalConfig[ids[0]].config
console.log(config.properties[0]);



let arrat={
    "UMAWSkt6": {
      "gJoJSXKhs06J3kBc": [
        {
          "propertyId": "Gjifr5JPD3jiUXrT",
          "equipmentId": "gJoJSXKhs06J3kBc",
          "gatewayInterfaceId": null,
          "redirectToProperties": null,
          "accessType": "REMOTE_READ_ONLY",
          "disabled": false,
          "name": "Battery level",
          "slug": "gjojsxkhs06j3kbc-battery-level-uyp1om17d9",
          "description": "",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "battery_level"
          },
          "scaling": null,
          "unit": "%",
          "kind": null,
          "createdAt": "2023-10-11T12:00:19.521Z",
          "updatedAt": "2023-10-11T12:00:19.521Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "b6738836-bc46-4a70-af67-909506d1dc54",
            "ws_wizard_property_id": "8fa57ca6-8207-4e97-90a4-1352a77a579c"
          }
        },
        {
          "propertyId": "_ifV2i0weO03Cw9b",
          "equipmentId": "gJoJSXKhs06J3kBc",
          "gatewayInterfaceId": null,
          "redirectToProperties": null,
          "accessType": "REMOTE_READ_ONLY",
          "disabled": false,
          "name": "Install state",
          "slug": "gjojsxkhs06j3kbc-install-state-t98jgauzfp",
          "description": "",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "install_state"
          },
          "scaling": null,
          "unit": null,
          "kind": null,
          "createdAt": "2023-10-11T12:00:19.521Z",
          "updatedAt": "2023-10-11T12:00:19.521Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "b6738836-bc46-4a70-af67-909506d1dc54",
            "ws_wizard_property_id": "384f1b57-9c02-45da-bf6e-4b076d8dc982"
          }
        },
        {
          "propertyId": "YC9yR77gOOoLKR64",
          "equipmentId": "gJoJSXKhs06J3kBc",
          "gatewayInterfaceId": null,
          "redirectToProperties": null,
          "accessType": "REMOTE_READ_ONLY",
          "disabled": false,
          "name": "Open state",
          "slug": "gjojsxkhs06j3kbc-open-state-fifcucnht6",
          "description": "",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "open_state"
          },
          "scaling": null,
          "unit": null,
          "kind": null,
          "createdAt": "2023-10-11T12:00:19.521Z",
          "updatedAt": "2023-10-11T12:00:19.521Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "b6738836-bc46-4a70-af67-909506d1dc54",
            "ws_wizard_property_id": "8dd3c630-478c-4ef6-8f44-e5c4cc652dab"
          }
        },
        {
          "propertyId": "thOvLWGG6Ebc8mFD",
          "equipmentId": "gJoJSXKhs06J3kBc",
          "gatewayInterfaceId": null,
          "redirectToProperties": null,
          "accessType": "REMOTE_READ_ONLY",
          "disabled": false,
          "name": "Signal Noise Ratio (SNR)",
          "slug": "gjojsxkhs06j3kbc-signal-noise-ratio-snr-ekdnv2icb4",
          "description": "Sensor signal noise ratio (SNR) value",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "@sys-snr"
          },
          "scaling": null,
          "unit": "dB",
          "kind": null,
          "createdAt": "2023-10-11T12:00:19.521Z",
          "updatedAt": "2023-10-11T12:00:19.521Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "b6738836-bc46-4a70-af67-909506d1dc54",
            "ws_wizard_property_id": "5e36b032-03d1-41f7-9306-05b156cd0559"
          }
        },
        {
          "propertyId": "RvqoDWnBx6xneyeO",
          "equipmentId": "gJoJSXKhs06J3kBc",
          "gatewayInterfaceId": null,
          "redirectToProperties": null,
          "accessType": "REMOTE_READ_ONLY",
          "disabled": false,
          "name": "Received Signal Strength Indication (RSSI)",
          "slug": "gjojsxkhs06j3kbc-received-signal-strength-indication-rssi-c8vy8btgks",
          "description": "Sensor received signal strength indication (RSSI) value",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "@sys-rssi"
          },
          "scaling": null,
          "unit": "dBm",
          "kind": null,
          "createdAt": "2023-10-11T12:00:19.521Z",
          "updatedAt": "2023-10-11T12:00:19.521Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "b6738836-bc46-4a70-af67-909506d1dc54",
            "ws_wizard_property_id": "3a0540a4-2db2-427d-b0c9-0cdbab416632"
          }
        },
        {
          "propertyId": "70AQdH3heMQX_1CQ",
          "equipmentId": "gJoJSXKhs06J3kBc",
          "gatewayInterfaceId": null,
          "redirectToProperties": null,
          "accessType": "REMOTE_READ_ONLY",
          "disabled": false,
          "name": "Raw encoded payload",
          "slug": "gjojsxkhs06j3kbc-raw-encoded-payload-b3zkkf1oer",
          "description": "Combination of raw encoded payload and it's respective port",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "@sys-rawPayload-uplink"
          },
          "scaling": null,
          "unit": null,
          "kind": null,
          "createdAt": "2023-10-11T12:00:19.521Z",
          "updatedAt": "2023-10-11T12:00:19.521Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "b6738836-bc46-4a70-af67-909506d1dc54",
            "ws_wizard_property_id": "37120138-a788-4208-af80-7a565e935175"
          }
        },
        {
          "propertyId": "VrioqeconJ87PW8h",
          "equipmentId": "gJoJSXKhs06J3kBc",
          "gatewayInterfaceId": null,
          "redirectToProperties": null,
          "accessType": "REMOTE_WRITE_ONLY",
          "disabled": false,
          "name": "Encoded downlink message",
          "slug": "gjojsxkhs06j3kbc-encoded-downlink-message-jow1nqtw8g",
          "description": "Send a combination of raw encoded payload (in Hex) and it's respective port <hex_message>:<port>",
          "timer": null,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "@sys-rawPayload-downlink"
          },
          "scaling": null,
          "unit": null,
          "kind": null,
          "createdAt": "2023-10-11T12:00:19.521Z",
          "updatedAt": "2023-10-11T12:00:19.521Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "b6738836-bc46-4a70-af67-909506d1dc54",
            "ws_wizard_property_id": "76f02ae4-6657-46ca-80b6-13c7a26df8f7"
          }
        },
        {
          "propertyId": "DeIc0u86teeoKYxv",
          "equipmentId": "gJoJSXKhs06J3kBc",
          "gatewayInterfaceId": null,
          "redirectToProperties": null,
          "accessType": "REMOTE_READ_ONLY",
          "disabled": false,
          "name": "Spreading Factor (SF)",
          "slug": "gjojsxkhs06j3kbc-spreading-factor-sf-uulcp8jyty",
          "description": "The value of the spreading factor for the lorawan sensor",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "@sys-sf"
          },
          "scaling": null,
          "unit": null,
          "kind": null,
          "createdAt": "2023-10-11T12:00:19.521Z",
          "updatedAt": "2023-10-11T12:00:19.521Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "b6738836-bc46-4a70-af67-909506d1dc54",
            "ws_wizard_property_id": "79265731-0642-4db4-8476-98624c4958cd"
          }
        },
        {
          "propertyId": "8nyIOb3O3fYjMtde",
          "equipmentId": "gJoJSXKhs06J3kBc",
          "gatewayInterfaceId": null,
          "redirectToProperties": null,
          "accessType": "REMOTE_READ_ONLY",
          "disabled": false,
          "name": "Frame counter",
          "slug": "gjojsxkhs06j3kbc-frame-counter-lomba5toy9",
          "description": "Number of uplinks as counted by the equipment",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "@sys-frame-cnt"
          },
          "scaling": null,
          "unit": null,
          "kind": null,
          "createdAt": "2023-10-11T12:00:19.521Z",
          "updatedAt": "2023-10-11T12:00:19.521Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "b6738836-bc46-4a70-af67-909506d1dc54",
            "ws_wizard_property_id": "3adf65b0-ceda-11ed-afa1-0242ac120002"
          }
        },
        {
          "propertyId": "NUhJcSQ93faozy5W",
          "equipmentId": "gJoJSXKhs06J3kBc",
          "gatewayInterfaceId": null,
          "redirectToProperties": null,
          "accessType": "REMOTE_READ_ONLY",
          "disabled": false,
          "name": "Battery level",
          "slug": "gjojsxkhs06j3kbc-battery-level-1kovnilgys",
          "description": "Percentage between 0 (empty) and 100 (full or powered)",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "@sys-battery-level"
          },
          "scaling": null,
          "unit": null,
          "kind": null,
          "createdAt": "2023-10-11T12:00:19.521Z",
          "updatedAt": "2023-10-11T12:00:19.521Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "b6738836-bc46-4a70-af67-909506d1dc54",
            "ws_wizard_property_id": "6f611aee-ca7b-40ab-8a90-8f1621c26213"
          }
        }
      ]
    },
    "bjajd9LX": {
      "26KmEv7Fd7GSsla7": [
        {
          "propertyId": "0PRUrk9J2v2GvfRy",
          "equipmentId": "26KmEv7Fd7GSsla7",
          "gatewayInterfaceId": null,
          "redirectToProperties": [
            "qrvCf5HhWahYUDEH"
          ],
          "accessType": "REMOTE_READ_ONLY",
          "disabled": false,
          "name": "analog input 1",
          "slug": "26kmev7fd7gssla7-analog-input-1-6lvv7rufph",
          "description": null,
          "timer": 600,
          "config": {
            "protocol": "MODBUS_IP",
            "modbusFunction": "READ_HOLDING_REGISTERS",
            "modbusSecondaryFunction": null,
            "modbusRegisterAddress": 18,
            "modbusDataFormat": "f32_abcd",
            "modbusNumberOfRawRegisters": null
          },
          "scaling": {
            "a": 1,
            "b": 0
          },
          "unit": "mV",
          "kind": null,
          "createdAt": "2023-11-14T14:00:26.990Z",
          "updatedAt": "2023-11-14T17:37:53.292Z",
          "tags": {}
        },
        {
          "propertyId": "DBKCiWQWS_bG0h88",
          "equipmentId": "26KmEv7Fd7GSsla7",
          "gatewayInterfaceId": null,
          "redirectToProperties": [
            "qrvCf5HhWahYUDEH"
          ],
          "accessType": "REMOTE_READ_WRITE",
          "disabled": false,
          "name": "relay 01",
          "slug": "cbw92-r01",
          "description": null,
          "timer": 600,
          "config": {
            "protocol": "MODBUS_IP",
            "modbusFunction": "READ_COILS",
            "modbusSecondaryFunction": "WRITE_SINGLE_COIL",
            "modbusRegisterAddress": 0,
            "modbusDataFormat": "uint16",
            "modbusNumberOfRawRegisters": null
          },
          "scaling": {
            "a": 1,
            "b": 0
          },
          "unit": null,
          "kind": null,
          "createdAt": "2023-11-14T14:16:37.109Z",
          "updatedAt": "2023-11-15T07:51:31.713Z",
          "tags": {}
        }
      ]
    },
    "og2znDae": {
      "DKTJnvLU8ZTqwlkk": [
        {
          "propertyId": "yCO0czKu5K9gXlBS",
          "equipmentId": "DKTJnvLU8ZTqwlkk",
          "gatewayInterfaceId": null,
          "redirectToProperties": [],
          "accessType": "REMOTE_READ_ONLY",
          "disabled": true,
          "name": "Battery level",
          "slug": "dktjnvlu8ztqwlkk-battery-level-e7jzl6eipd",
          "description": "",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "battery_level"
          },
          "scaling": null,
          "unit": "%",
          "kind": null,
          "createdAt": "2023-10-11T19:31:23.218Z",
          "updatedAt": "2023-11-14T16:11:53.624Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "a5d291b5-e3e1-4700-8382-391cbfe3d833",
            "ws_wizard_property_id": "85a17f1a-a7ba-4701-b5fb-a1411324d91c"
          }
        },
        {
          "propertyId": "vVFk46cQ1iUpbzw5",
          "equipmentId": "DKTJnvLU8ZTqwlkk",
          "gatewayInterfaceId": null,
          "redirectToProperties": [
            "R_g31IwOhkK1JGzx"
          ],
          "accessType": "REMOTE_READ_ONLY",
          "disabled": false,
          "name": "Humidity",
          "slug": "dktjnvlu8ztqwlkk-humidity-fzhhi65l5d",
          "description": "",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "humidity"
          },
          "scaling": null,
          "unit": "%",
          "kind": null,
          "createdAt": "2023-10-11T19:31:23.218Z",
          "updatedAt": "2023-11-14T10:01:53.456Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "a5d291b5-e3e1-4700-8382-391cbfe3d833",
            "ws_wizard_property_id": "1c21641f-d137-48f1-ac70-f5377d9ae7ed"
          }
        },
        {
          "propertyId": "TuQOqQXzXBNhOa7Z",
          "equipmentId": "DKTJnvLU8ZTqwlkk",
          "gatewayInterfaceId": null,
          "redirectToProperties": [
            "idL4VHzx3W5sWZbW"
          ],
          "accessType": "REMOTE_READ_ONLY",
          "disabled": false,
          "name": "Temperature",
          "slug": "dktjnvlu8ztqwlkk-temperature-8j4holx2va",
          "description": "",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "temperature"
          },
          "scaling": null,
          "unit": "°C",
          "kind": null,
          "createdAt": "2023-10-11T19:31:23.218Z",
          "updatedAt": "2023-11-14T10:01:55.161Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "a5d291b5-e3e1-4700-8382-391cbfe3d833",
            "ws_wizard_property_id": "42b0f338-55f8-4480-b903-33b74971be2c"
          }
        },
        {
          "propertyId": "LwMKTxiB4pYw0I5c",
          "equipmentId": "DKTJnvLU8ZTqwlkk",
          "gatewayInterfaceId": null,
          "redirectToProperties": null,
          "accessType": "REMOTE_READ_ONLY",
          "disabled": true,
          "name": "Signal Noise Ratio (SNR)",
          "slug": "dktjnvlu8ztqwlkk-signal-noise-ratio-snr-ivw8wu3d8q",
          "description": "Sensor signal noise ratio (SNR) value",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "@sys-snr"
          },
          "scaling": null,
          "unit": "dB",
          "kind": null,
          "createdAt": "2023-10-11T19:31:23.218Z",
          "updatedAt": "2023-10-11T19:31:23.218Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "a5d291b5-e3e1-4700-8382-391cbfe3d833",
            "ws_wizard_property_id": "5e36b032-03d1-41f7-9306-05b156cd0559"
          }
        },
        {
          "propertyId": "EWUeohow0t22TzOn",
          "equipmentId": "DKTJnvLU8ZTqwlkk",
          "gatewayInterfaceId": null,
          "redirectToProperties": null,
          "accessType": "REMOTE_READ_ONLY",
          "disabled": true,
          "name": "Received Signal Strength Indication (RSSI)",
          "slug": "dktjnvlu8ztqwlkk-received-signal-strength-indication-rssi-p79jnyf13r",
          "description": "Sensor received signal strength indication (RSSI) value",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "@sys-rssi"
          },
          "scaling": null,
          "unit": "dBm",
          "kind": null,
          "createdAt": "2023-10-11T19:31:23.218Z",
          "updatedAt": "2023-10-11T19:31:23.218Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "a5d291b5-e3e1-4700-8382-391cbfe3d833",
            "ws_wizard_property_id": "3a0540a4-2db2-427d-b0c9-0cdbab416632"
          }
        },
        {
          "propertyId": "Rzvuq4B1NYr33MMy",
          "equipmentId": "DKTJnvLU8ZTqwlkk",
          "gatewayInterfaceId": null,
          "redirectToProperties": null,
          "accessType": "REMOTE_READ_ONLY",
          "disabled": true,
          "name": "Raw encoded payload",
          "slug": "dktjnvlu8ztqwlkk-raw-encoded-payload-f7liattr5s",
          "description": "Combination of raw encoded payload and it's respective port",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "@sys-rawPayload-uplink"
          },
          "scaling": null,
          "unit": null,
          "kind": null,
          "createdAt": "2023-10-11T19:31:23.218Z",
          "updatedAt": "2023-10-11T19:31:23.218Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "a5d291b5-e3e1-4700-8382-391cbfe3d833",
            "ws_wizard_property_id": "37120138-a788-4208-af80-7a565e935175"
          }
        },
        {
          "propertyId": "QrdeEPkXexd8XYRx",
          "equipmentId": "DKTJnvLU8ZTqwlkk",
          "gatewayInterfaceId": null,
          "redirectToProperties": null,
          "accessType": "REMOTE_WRITE_ONLY",
          "disabled": true,
          "name": "Encoded downlink message",
          "slug": "dktjnvlu8ztqwlkk-encoded-downlink-message-nng6s4gffy",
          "description": "Send a combination of raw encoded payload (in Hex) and it's respective port <hex_message>:<port>",
          "timer": null,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "@sys-rawPayload-downlink"
          },
          "scaling": null,
          "unit": null,
          "kind": null,
          "createdAt": "2023-10-11T19:31:23.218Z",
          "updatedAt": "2023-10-11T19:31:23.218Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "a5d291b5-e3e1-4700-8382-391cbfe3d833",
            "ws_wizard_property_id": "76f02ae4-6657-46ca-80b6-13c7a26df8f7"
          }
        },
        {
          "propertyId": "30UHnZWg0m5BaeQ1",
          "equipmentId": "DKTJnvLU8ZTqwlkk",
          "gatewayInterfaceId": null,
          "redirectToProperties": null,
          "accessType": "REMOTE_READ_ONLY",
          "disabled": true,
          "name": "Spreading Factor (SF)",
          "slug": "dktjnvlu8ztqwlkk-spreading-factor-sf-7i63ajy655",
          "description": "The value of the spreading factor for the lorawan sensor",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "@sys-sf"
          },
          "scaling": null,
          "unit": null,
          "kind": null,
          "createdAt": "2023-10-11T19:31:23.218Z",
          "updatedAt": "2023-10-11T19:31:23.218Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "a5d291b5-e3e1-4700-8382-391cbfe3d833",
            "ws_wizard_property_id": "79265731-0642-4db4-8476-98624c4958cd"
          }
        },
        {
          "propertyId": "3tlKUhzmaAe6nOvo",
          "equipmentId": "DKTJnvLU8ZTqwlkk",
          "gatewayInterfaceId": null,
          "redirectToProperties": null,
          "accessType": "REMOTE_READ_ONLY",
          "disabled": true,
          "name": "Frame counter",
          "slug": "dktjnvlu8ztqwlkk-frame-counter-z82r5c1p5m",
          "description": "Number of uplinks as counted by the equipment",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "@sys-frame-cnt"
          },
          "scaling": null,
          "unit": null,
          "kind": null,
          "createdAt": "2023-10-11T19:31:23.218Z",
          "updatedAt": "2023-10-11T19:31:23.218Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "a5d291b5-e3e1-4700-8382-391cbfe3d833",
            "ws_wizard_property_id": "3adf65b0-ceda-11ed-afa1-0242ac120002"
          }
        },
        {
          "propertyId": "zR5LrWh1AaFSVVv8",
          "equipmentId": "DKTJnvLU8ZTqwlkk",
          "gatewayInterfaceId": null,
          "redirectToProperties": null,
          "accessType": "REMOTE_READ_ONLY",
          "disabled": true,
          "name": "Battery level",
          "slug": "dktjnvlu8ztqwlkk-battery-level-2ors6lwhsi",
          "description": "Percentage between 0 (empty) and 100 (full or powered)",
          "timer": 600,
          "config": {
            "protocol": "LORAWAN_V1_0",
            "codecPropertyId": "@sys-battery-level"
          },
          "scaling": null,
          "unit": null,
          "kind": null,
          "createdAt": "2023-10-11T19:31:23.218Z",
          "updatedAt": "2023-10-11T19:31:23.218Z",
          "tags": {
            "ws_created_with_wizard": "true",
            "ws_wizard_equipment_id": "a5d291b5-e3e1-4700-8382-391cbfe3d833",
            "ws_wizard_property_id": "6f611aee-ca7b-40ab-8a90-8f1621c26213"
          }
        }
      ]
    }
  }

