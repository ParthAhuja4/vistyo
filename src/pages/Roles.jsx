import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveRole,
  setRoles,
  setRoleKeywords,
  setChannelIds,
} from "../store/roleSlice.js";
import service from "../appwrite/Databases.js";
import { Input, Button, RoleCard } from "../components/index.js";
import DOMPurify from "dompurify";
import { useState, useEffect } from "react";

function Roles() {
  const dispatch = useDispatch();
  const roles = useSelector((state) => state.roles.roles);
  const plan = useSelector((state) => state.auth.plan);
  const roleKeywords = useSelector((state) => state.roles.roleKeywords) || [];
  const channelIds = useSelector((state) => state.roles.channelIds) || [];
  const activeRole = useSelector((state) => state.roles.activeRole) || {};

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activatingId, setActivatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchAllRolesData = async () => {
    try {
      const roleRes = await service.listUserRoles();
      if (!roleRes?.total) {
        dispatch(setRoles([]));
        dispatch(setRoleKeywords([]));
        dispatch(setChannelIds([]));
        dispatch(setActiveRole({}));
        setLoading(false);
        return;
      }
      const updatedRoles =
        roleRes?.documents.map((r) => ({ id: r.$id, name: r.name })) || [];

      const [roleKeywordsData, channelIdsData] = await Promise.all([
        Promise.all(
          updatedRoles.map(async ({ id }) => {
            const kRes = await service.listRoleKeywords(id);
            return { id, keywords: kRes?.keywords || [] };
          }),
        ),
        Promise.all(
          updatedRoles.map(async ({ id }) => {
            const cRes = await service.listChannelFilters(id);
            return { id, channelIds: cRes?.channelIds || [] };
          }),
        ),
      ]);

      dispatch(setRoles(updatedRoles));
      dispatch(setRoleKeywords(roleKeywordsData));
      dispatch(setChannelIds(channelIdsData));

      try {
        const activeRole = await service.getActiveRole();
        if (activeRole?.id) {
          dispatch(setActiveRole(activeRole));
        } else {
          dispatch(setActiveRole({}));
        }
      } catch (error) {
        console.error("Error getting active role:", error.message);
        dispatch(setActiveRole({}));
      }
    } catch (error) {
      console.error("Error fetching roles data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRolesData();
  }, []);

  const onSubmit = async ({ name, keywords, channelIds }) => {
    try {
      setCreating(true);
      const safeName = DOMPurify.sanitize(name.trim());
      const keywordArray = DOMPurify.sanitize(keywords.trim()).split(/\s+/);
      const channelArray = DOMPurify.sanitize(channelIds.trim()).split(/\s+/);

      const alreadyExists = roles.some(
        (r) => r.name.toLowerCase() === safeName.toLowerCase(),
      );
      if (alreadyExists) {
        alert("A role with this name already exists.");
        return;
      }

      const newRole = await service.createRole(safeName);
      if (!newRole?.$id) throw new Error("Role creation failed");

      await Promise.all([
        service.createRoleKeywords(newRole.$id, keywordArray),
        service.createChannelFilter(newRole.$id, channelArray),
      ]);

      reset();
      await fetchAllRolesData();
    } catch (error) {
      console.error("Error creating role:", error);
      alert(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleActivate = async (role) => {
    try {
      setActivatingId(role.id);

      try {
        const prevActiveRole = await service.getActiveRole();
        if (prevActiveRole?.id) {
          await service.updateRole(
            prevActiveRole.id,
            prevActiveRole.name,
            false,
          );
        }
      } catch (e) {
        console.error("Failed to fetch active role:", e.message);
      }

      const updated = await service.updateRole(role.id, role.name, true);
      if (!updated) throw new Error("Role activation failed");
      if (updated) {
        dispatch(setActiveRole(role));
      }
    } catch (error) {
      console.error("Error activating role:", error);
    } finally {
      setActivatingId(null);
    }
  };

  const handleDelete = async (role) => {
    try {
      setDeletingId(role.id);
      const res = await service.deleteRole(role.id);
      if (!res) return;
      const updatedRoles = roles.filter((r) => r.id !== role.id);
      const updatedKeywords = roleKeywords.filter((rk) => rk.id !== role.id);
      const updatedChannelIds = channelIds.filter((c) => c.id !== role.id);

      dispatch(setRoles(updatedRoles));
      dispatch(setRoleKeywords(updatedKeywords));
      dispatch(setChannelIds(updatedChannelIds));

      if (activeRole?.id === role.id) {
        dispatch(setActiveRole({}));
      }
    } catch (error) {
      console.error("Error deleting role:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading roles...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 p-6">
      <h2 className="text-center text-2xl font-semibold text-[#2e2e2e] dark:text-[#fefefe]">
        Your Roles
      </h2>

      {!(plan === "free" || plan === "lite") || roles.length < 1 ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-8 rounded-2xl bg-white p-6 shadow-lg dark:bg-[#222]"
        >
          <h3 className="text-center text-xl font-semibold text-[#2e2e2e] dark:text-[#fefefe]">
            Create a New Role
          </h3>

          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Role Name
              </label>
              <Input
                id="name"
                placeholder="FrontendDev"
                {...register("name", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="keywords" className="block text-sm font-medium">
                Keywords
              </label>
              <Input
                id="keywords"
                placeholder="react tailwind angular"
                {...register("keywords", { required: true })}
              />
              <p className="text-xs text-gray-500">Space-separated keywords</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="channelIds" className="block text-sm font-medium">
                Channel IDs
              </label>
              <a
                href="https://www.tunepocket.com/youtube-channel-id-finder/"
                target="_blank"
                className="text-xs font-semibold text-[#a3254b] hover:underline"
              >
                Need Help Finding Channel Ids?
              </a>
              <textarea
                id="channelIds"
                placeholder="UC123 UC456"
                rows={3}
                {...register("channelIds", { required: true })}
                className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-[#111] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              />
              <p className="text-xs text-gray-500">
                Space-separated YouTube channel IDs
              </p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Button
              type="submit"
              variant="secondary"
              className="w-full sm:w-auto"
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Role"}
            </Button>
          </div>
        </form>
      ) : null}

      <div className="space-y-3">
        {roles.length > 0 ? (
          roles.map((role) => {
            const keywordEntry = roleKeywords.find((r) => r.id === role.id);
            const channelEntry = channelIds.find((r) => r.id === role.id);

            return (
              <RoleCard
                activeRoleId={activeRole?.id}
                key={role.id}
                role={role}
                plan={plan}
                keywords={keywordEntry?.keywords || []}
                channelIds={channelEntry?.channelIds || []}
                onActivate={handleActivate}
                onDelete={handleDelete}
                activating={activatingId === role.id}
                deleting={deletingId === role.id}
              />
            );
          })
        ) : (
          <p className="text-center text-sm text-gray-700 dark:text-gray-400">
            You don't have any roles yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default Roles;
