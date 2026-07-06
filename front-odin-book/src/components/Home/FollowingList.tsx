import { User } from "@/types";
import { myState } from '../../Reducers/UserReducer'
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Link } from "react-router-dom";
import { toggleFollow } from '../../../services/onHandleToggleFollow'
import { useFollow } from "../../contex/FollowContext";

export default function FollowingList ({ users, user, state }: { users: User[], user: User, state: myState }) {
  const { followAction, unfollowAction, isFollowing } = useFollow()

  return (
    <>
      {/* ── Section header ── */}
      <div
        style={{
          paddingBottom: '10px',
          marginBottom: '4px',
          borderBottom: '1px solid #1e1e35',
        }}
      >
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.65rem',
            color: '#00ff87',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textShadow: '0 0 6px #00ff8799',
          }}
        >
        Suggested
        </span>
      </div>

      {users.map((userl) => {
        const following = isFollowing(userl.id, user.id)
        return (
          <div
            key={userl.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              padding: '10px 12px',
              margin: '5px 0',
              background: '#0f0f1a',
              border: '1px solid #1e1e35',
              borderRadius: '2px',
              transition: 'border-color 0.2s ease, background 0.2s ease',
              gap: '8px',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.borderColor = '#00ff8744'
              el.style.background = '#12121f'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.borderColor = '#1e1e35'
              el.style.background = '#0f0f1a'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                to={`/profile/${userl.username}`}
                style={{ display: 'block', background: 'transparent', borderRadius: '0' }}
              >
                <Avatar
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '2px',
                    border: '1.5px solid #1e1e35',
                  }}
                >
                  <AvatarImage src={userl.profileImg || '/profile2.svg'} />
                  <AvatarFallback />
                </Avatar>
              </Link>

              <span
                style={{
                  fontFamily: "'Rajdhani', monospace",
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  color: '#c0c0d8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {userl.username}
              </span>
            </div>

            {/* Follow / Unfollow button */}
            <button
              onClick={() => {
                toggleFollow(userl, user, state, unfollowAction, followAction)
              }}
              style={{
                height: '28px',
                padding: '0 12px',
                fontSize: '0.7rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                border: following ? '1px solid #1e1e35' : '1px solid #00ff8777',
                color: following ? '#6a6a8a' : '#00ff87',
                background: 'transparent',
                borderRadius: '2px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                margin: 0,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                if (following) {
                  el.style.borderColor = '#ff009077'
                  el.style.color = '#ff0090'
                } else {
                  el.style.background = '#00ff87'
                  el.style.color = '#07070d'
                }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                if (following) {
                  el.style.borderColor = '#1e1e35'
                  el.style.color = '#6a6a8a'
                } else {
                  el.style.background = 'transparent'
                  el.style.color = '#00ff87'
                }
              }}
            >
              {following ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        )
      })}
    </>
  )
}
