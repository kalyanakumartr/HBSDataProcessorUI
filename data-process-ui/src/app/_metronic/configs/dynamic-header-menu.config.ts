export const DynamicHeaderMenuConfig = {
  "items": [
      {
          "menuName": "Dashboard",
          "alignment": "left",
          "bullet": "dot",
          "icon": "icon-home",
          "page": "/dashboard",
          "permission": null,
          "root": true,
          "title": "Dashboard",
          "toggle": "click",
          "translate": "MENU.DASHBOARD"
      },
      {
          "menuName": "WorkAllocation",
          "alignment": "left",
          "bullet": "",
          "icon": "icon-settings",
          "page": "javascript:;",
          "permission": null,
          "root": true,
          "title": "WorkAllocation",
          "toggle": "click",
          "translate": "MENU.WORKALLOCATION",
          "submenu": [
              {
                  "menuName": "Work Upload",
                  "alignment": "left",
                  "bullet": "",
                  "icon": "icon-tag",
                  "page": "javascript:loadContent('a9dc3f7729b51d26dc20af48c03dfee6', '','false');",
                  "permission": null,
                  "root": false,
                  "title": "Work Upload",
                  "toggle": "click",
                  "translate": "MENU.WORK UPLOAD",
                  "submenu": [
                      {
                          "menuName": "Attendance",
                          "alignment": "left",
                          "bullet": "",
                          "icon": "icon-tag",
                          "page": "javascript:loadContent('a9dc3f7729b51d26dc20af48c03dfee6', '','false');",
                          "permission": null,
                          "root": false,
                          "title": "Attendance",
                          "toggle": "click",
                          "translate": "MENU.ATTENDANCE"
                      },
                      {
                          "menuName": "Performance",
                          "alignment": "left",
                          "bullet": "",
                          "icon": "icon-bar-chart",
                          "page": "javascript:loadContent('bcca2120ed2c00bcf732c74ca8026490/Consumer', '','false');",
                          "permission": null,
                          "root": false,
                          "title": "Performance",
                          "toggle": "click",
                          "translate": "MENU.PERFORMANCE"
                      }
                  ]
              },
              {
                  "menuName": "Daily Log",
                  "alignment": "left",
                  "bullet": "",
                  "icon": "icon-pencil",
                  "page": "javascript:;",
                  "permission": null,
                  "root": false,
                  "title": "Daily Log",
                  "toggle": "click",
                  "translate": "MENU.DAILY LOG"
              }
          ]
      },
      {
          "menuName": "Reports",
          "alignment": "left",
          "bullet": "",
          "icon": "icon-bar-chart",
          "page": "javascript:loadContent('bcca2120ed2c00bcf732c74ca8026490/Employee', '','false');",
          "permission": null,
          "root": true,
          "title": "Reports",
          "toggle": "click",
          "translate": "MENU.REPORTS"
      }
  ]
};
